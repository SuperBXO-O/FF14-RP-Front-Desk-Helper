const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const defaultApp = path.join(__dirname, "..", "public", "index.html");
const appPath = process.env.INPA_APP || defaultApp;
const html = fs.readFileSync(appPath, "utf8");
const coreMarker = "核心逻辑（浏览器 / Node 通用）";
const markerIndex = html.indexOf(coreMarker);
assert.notEqual(markerIndex, -1, "core marker");
const start = html.indexOf("(function (root) {", markerIndex);
const endMarker = html.indexOf("})(typeof globalThis", start);
const end = html.indexOf(";", endMarker) + 1;
assert.ok(start >= 0 && endMarker > start && end > endMarker, "core bounds");
const coreSource = html.slice(start, end);

function loadCore() {
  const context = {
    console,
    TextDecoder,
    TextEncoder,
    Uint8Array,
    Uint32Array
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(coreSource, context, { filename: appPath });
  const core = context.INPACore;
  core.setItems([
    {
      key: "zhiming",
      biz: "指名（店内）",
      token: "指名信物",
      price: 50,
      staff: 40,
      unit: "个/半小时",
      kind: "time"
    },
    {
      key: "waitdai",
      biz: "外带",
      token: "外带信物",
      price: 60,
      staff: 48,
      unit: "个/半小时",
      kind: "time"
    },
    {
      key: "baojian",
      biz: "包间",
      token: "",
      price: 60,
      staff: 48,
      unit: "个/半小时",
      kind: "time"
    },
    {
      key: "gift",
      biz: "礼品",
      token: "礼品信物",
      price: 100,
      staff: 80,
      unit: "个",
      kind: "count"
    },
    {
      key: "giftx",
      biz: "定制礼品",
      token: "模特首饰",
      price: 0,
      share: 0.8,
      unit: "个",
      kind: "custom"
    },
    {
      key: "champ",
      biz: "香槟塔",
      token: "",
      price: 666,
      staff: 333,
      unit: "个",
      kind: "count",
      champ: true,
      noToken: true
    },
    {
      key: "special",
      biz: "特殊服务",
      token: "特殊服务信物",
      price: 150,
      staff: 120,
      unit: "个/半小时",
      kind: "time"
    }
  ]);
  Object.assign(core.CONFIG, {
    baseSalary: 200,
    rewardMultiplier: 1,
    champStaff: 333,
    champDj: 166,
    champShop: 167,
    djStaff: "",
    settleMode: "profit",
    frontdeskBase: 0,
    frontdeskPerUnit: 0,
    frontdeskShare: 0
  });
  return core;
}

function close(actual, expected, message) {
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `${message}: expected ${expected}, got ${actual}`
  );
}

test("time services price guests × staff × hours × two", () => {
  const core = loadCore();
  const halfHour = core.computeSale({
    biz: "指名（店内）",
    guests: 1,
    staff: 1,
    hours: 0.5
  });
  close(halfHour.units, 1, "half-hour units");
  close(halfHour.price, 50, "half-hour price");

  const mixed = core.computeSale({
    biz: "外带",
    guests: 2,
    staff: 3,
    hours: 1.5
  });
  close(mixed.units, 18, "1.5-hour units");
  close(mixed.price, 1080, "1.5-hour price");

  const special = core.computeSale({
    biz: "特殊服务",
    guests: 4,
    staff: 2,
    hours: 2.5
  });
  close(special.units, 40, "2.5-hour units");
  close(special.price, 6000, "2.5-hour price");
});

test("count, custom gift and champagne price independently", () => {
  const core = loadCore();
  const gift = core.computeSale({ biz: "礼品", giftCount: 5 });
  close(gift.price, 500, "gift total");
  close(gift.units, 5, "gift units");

  const custom = core.computeSale({
    biz: "定制礼品",
    giftCount: 1,
    customAmount: 888
  });
  close(custom.price, 888, "custom total");
  close(custom.units, 1, "custom units");

  const champagne = core.computeSale({
    biz: "香槟塔",
    giftCount: 3
  });
  close(champagne.price, 1998, "champagne total");
  assert.equal(champagne.lines.length, 0, "champagne has no token row");
});

test("each bound token gets its own quantity in the sale line", () => {
  const core = loadCore();
  core.setItems(
    core.CONFIG.items.map((item) =>
      item.key === "baojian"
        ? Object.assign({}, item, {
            token: "教堂爆米花、重生之境",
            bindings: [
              { id: 1, name: "教堂爆米花" },
              { id: 2, name: "重生之境" }
            ]
          })
        : item
    )
  );
  const sale = {
    biz: "包间",
    key: "baojian",
    guests: 1,
    staff: 1,
    hours: 0.5
  };
  core.snapshotSaleRecord(sale);
  assert.equal(
    core.saleLineText(core.computeSale(sale)),
    "教堂爆米花×1、重生之境×1"
  );
});

test("settlement applies reward multiplier only to named and takeout", () => {
  const core = loadCore();
  const result = core.computeSettlement(
    {
      staffId: "A",
      zhiming: 4,
      waitdai: 2,
      gift: 3,
      champ: 1,
      mult: 3,
      base: 200
    },
    core.CONFIG
  );
  close(result.AS, 589, "service settlement");
  close(result.AG, 240, "gift settlement");
  close(result.M, 829, "settlement subtotal");
  close(result.P, 512, "reward amount");
  close(result.Q, 1541, "wage total");
});

test("custom tip and champagne split use their configured shares", () => {
  const core = loadCore();
  const result = core.computeSettlement(
    {
      staffId: "A",
      giftx: 1,
      tip: 888,
      champ: 1,
      base: 0,
      mult: 1
    },
    core.CONFIG
  );
  close(result.AG, 710.4, "custom tip share");
  close(result.Q, 1043.4, "staff wage including champagne");

  const all = core.computeAll(
    [{ staffId: "A", champ: 2 }],
    Object.assign({}, core.CONFIG, { djStaff: "" })
  );
  const dj = all.merged.find((row) => row.staffId === "DJ");
  close(dj.Q, 332, "DJ share");
  close(1332 - 666 - 332, 334, "shop retains 334");
});

test("unsettled stock and amount reconcile without negative carry", () => {
  const core = loadCore();
  const sales = [
    { biz: "指名（店内）", guests: 1, staff: 1, hours: 1 }
  ];
  const partial = core.report(sales, [{ staffId: "A", zhiming: 1 }], core.CONFIG);
  close(partial.unsettledAmount, 50, "one token still outside");

  const exactly = core.report(sales, [{ staffId: "A", zhiming: 2 }], core.CONFIG);
  close(exactly.unsettledAmount, 0, "fully returned");

  const over = core.report(sales, [{ staffId: "A", zhiming: 3 }], core.CONFIG);
  const row = over.agg.stock.find((entry) => entry.key === "zhiming");
  close(row.unsettled, 0, "over-returned stock clamps at zero");
  close(over.unsettledAmount, 0, "over-returned amount clamps at zero");
  assert.equal(over.overSettledDetail.length, 1, "over-returned exception row");
  assert.equal(over.overSettledDetail[0].count, 1, "over-returned exception count");
  assert.equal(over.overSettledDetail[0].amount, 50, "over-returned exception amount");
});

test("over-returned tokens affect profit once through staff wages", () => {
  const core = loadCore();
  const cfg = Object.assign({}, core.CONFIG, {
    baseSalary: 0,
    settleMode: "profit",
    frontdeskShare: 0
  });
  const sales = [
    { biz: "指名（店内）", guests: 1, staff: 1, hours: 1 }
  ];
  const settlements = [{ staffId: "A", zhiming: 3, base: 0 }];
  const report = core.report(sales, settlements, cfg);
  close(report.revenue, 100, "over-return revenue");
  close(report.staffCost, 120, "all returned tokens earn wages");
  close(report.overSettledAmount, 50, "over-return exception amount");
  close(report.frontProfitBase, 0, "profit share base floor");
  close(report.grossProfit, -20, "gross profit after extra staff wage");
  close(report.netProfit, -20, "net profit after extra staff wage");
  close(
    core.computeAll(settlements, cfg, sales).merged[0].Q,
    120,
    "over-returned token wage remains paid"
  );
});

test("sale snapshots freeze price and item identity", () => {
  const core = loadCore();
  const sale = {
    biz: "指名（店内）",
    key: "zhiming",
    guests: 2,
    staff: 1,
    hours: 1
  };
  core.snapshotSaleRecord(sale);
  close(core.computeSale(sale).price, 200, "original sale price");

  core.setItems(
    core.CONFIG.items.map((item) =>
      item.key === "zhiming"
        ? Object.assign({}, item, { biz: "改名后的指名", price: 80 })
        : item
    )
  );
  close(core.computeSale(sale).price, 200, "snapshot survives rename and price change");
  close(core.report([sale], [], core.CONFIG).revenue, 200, "snapshot report revenue");
});

test("unsettled value uses transaction price snapshots", () => {
  const core = loadCore();
  const first = {
    biz: "指名（店内）",
    key: "zhiming",
    guests: 1,
    staff: 1,
    hours: 1
  };
  core.snapshotSaleRecord(first);
  core.CONFIG.items.find((item) => item.key === "zhiming").price = 80;
  const second = {
    biz: "指名（店内）",
    key: "zhiming",
    guests: 1,
    staff: 1,
    hours: 1
  };
  core.snapshotSaleRecord(second);
  const report = core.report([first, second], [], core.CONFIG);
  close(report.unsettledAmount, 260, "two price tiers remain outstanding");
});

test("settlement snapshots freeze wage rates and DJ split", () => {
  const core = loadCore();
  const settlement = {
    staffId: "A",
    zhiming: 4,
    waitdai: 2,
    gift: 3,
    champ: 1,
    mult: 2,
    base: 200
  };
  core.snapshotSettlementRecord(settlement);
  const original = core.computeSettlement(settlement, core.CONFIG);
  close(original.Q, 1285, "original settlement wage");

  core.setItems(
    core.CONFIG.items.map((item) =>
      Object.assign({}, item, {
        price: item.price + 10,
        staff: item.staff == null ? item.staff : item.staff + 10,
        share: item.share == null ? item.share : item.share / 2
      })
    )
  );
  Object.assign(core.CONFIG, {
    champStaff: 999,
    champDj: 999,
    champShop: 0,
    djStaff: "NEW-DJ"
  });

  const after = core.computeSettlement(settlement, core.CONFIG);
  close(after.Q, original.Q, "snapshot settlement wage");
  const merged = core.computeAll([settlement], core.CONFIG).merged;
  const originalDj = merged.find((row) => row.staffId === "DJ");
  assert.ok(originalDj, "snapshot keeps original DJ recipient");
  close(originalDj.Q, 166, "snapshot DJ split");
  assert.equal(merged.some((row) => row.staffId === "NEW-DJ"), false);
});

test("void and refund vouchers stay in storage but leave profit and stock", () => {
  const core = loadCore();
  const sales = [
    { biz: "礼品", giftCount: 2, status: "void" },
    { biz: "礼品", giftCount: 1, status: "refund" }
  ];
  const settlements = [
    { staffId: "A", gift: 2, status: "void" },
    { staffId: "A", gift: 1, status: "refund" }
  ];
  const report = core.report(sales, settlements, core.CONFIG);
  close(report.revenue, 0, "void and refund revenue");
  close(report.staffCost, 0, "void and refund wage cost");
  close(report.unsettledAmount, 0, "void and refund unsettled");
  assert.equal(core.computeAll(settlements, core.CONFIG).merged.length, 0);
});

test("negative or infinite imported inputs never create negative money", () => {
  const core = loadCore();
  const invalidSale = core.computeSale({
    biz: "礼品",
    giftCount: -3
  });
  close(invalidSale.units, 0, "negative sale units");
  close(invalidSale.price, 0, "negative sale price");
  const infiniteSale = core.computeSale({
    biz: "礼品",
    giftCount: Infinity
  });
  close(infiniteSale.units, 0, "infinite sale units");
  close(infiniteSale.price, 0, "infinite sale price");

  const invalidWage = core.computeSettlement(
    {
      staffId: "A",
      zhiming: -4,
      waitdai: Infinity,
      gift: -2,
      tip: -100,
      base: -200,
      mult: -3
    },
    core.CONFIG
  );
  assert.ok(invalidWage.Q >= 0, `negative wage total: ${invalidWage.Q}`);
  close(invalidWage.Q, 0, "invalid settlement clamps to zero");

  const invalidReport = core.report(
    [{ biz: "礼品", giftCount: -3 }],
    [{ staffId: "A", zhiming: -2, gift: -1, base: -200 }],
    core.CONFIG
  );
  assert.ok(invalidReport.revenue >= 0, `negative revenue: ${invalidReport.revenue}`);
  assert.ok(invalidReport.staffCost >= 0, `negative staff cost: ${invalidReport.staffCost}`);
});

test("front desk wage modes and zero profit floor are consistent", () => {
  const core = loadCore();
  const sales = [
    { biz: "指名（店内）", guests: 1, staff: 1, hours: 1 },
    { biz: "香槟塔", giftCount: 2 }
  ];
  const settlements = [{ staffId: "A", champ: 2 }];

  const wage = core.report(
    sales,
    settlements,
    Object.assign({}, core.CONFIG, {
      settleMode: "wage",
      frontdeskBase: 500,
      frontdeskPerUnit: 10
    })
  );
  close(wage.frontUnits, 4, "front desk units");
  close(wage.frontCost, 540, "front desk wage cost");

  const profit = core.report(
    sales,
    settlements,
    Object.assign({}, core.CONFIG, {
      settleMode: "profit",
      frontdeskShare: 0.2
    })
  );
  close(
    profit.frontProfitBase,
    Math.max(0, core.round2(profit.revenue - profit.staffCost - profit.unsettledAmount)),
    "profit distribution base"
  );
  close(profit.frontCost, core.round2(profit.frontProfitBase * 0.2), "profit share");
  close(profit.netProfit, core.round2(profit.frontProfitBase - profit.frontCost), "net profit");
});

test("exported report totals equal the screen report", () => {
  const core = loadCore();
  const sales = [
    { biz: "指名（店内）", guests: 2, staff: 1, hours: 1 },
    { biz: "包间", guests: 2, staff: 1, hours: 1 },
    { biz: "礼品", giftCount: 3 },
    { biz: "定制礼品", giftCount: 1, customAmount: 888 }
  ];
  const settlements = [
    { staffId: "A", zhiming: 4, baojian: 2, gift: 3, giftx: 1, tip: 888 }
  ];
  const report = core.report(sales, settlements, core.CONFIG);
  const sheet = core
    .exportSheets(sales, settlements, core.CONFIG, [])
    .find((entry) => entry.name === "报表").rows;
  const value = (name) => sheet.find((row) => row[0] === name)[1];

  close(value("营业收入"), report.revenue, "exported revenue");
  close(value("店员工资成本"), report.staffCost, "exported staff cost");
  close(value("前台工资成本"), report.frontCost, "exported front cost");
  close(value("毛利润"), report.grossProfit, "exported gross profit");
  close(value("未结算金额"), report.unsettledAmount, "exported unsettled");
  close(value("净利润"), report.netProfit, "exported net profit");
});
