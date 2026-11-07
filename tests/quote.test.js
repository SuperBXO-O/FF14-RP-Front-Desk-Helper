const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const appPath = process.env.INPA_APP || path.join(__dirname, "..", "public", "index.html");
const html = fs.readFileSync(appPath, "utf8");
const start = html.indexOf("(function (root) {", html.indexOf("核心逻辑（浏览器 / Node 通用）"));
const end = html.indexOf(";", html.indexOf("})(typeof globalThis", start)) + 1;
assert.ok(start >= 0 && end > start, "core bounds");

function coreFor(kind, mode) {
  const context = { console, module: { exports: {} } };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(html.slice(start, end), context, { filename: appPath });
  const core = context.INPACore;
  core.setItems([{ key: "quote", biz: "用户自定业务", token: "", kind, billingMode: mode, price: 10, share: 0.25, unit: "个" }]);
  return core;
}

const sale = { key: "quote", guests: 2, staff: 3, hours: 1.5, giftCount: 4, customAmount: 125 };
const cases = [
  ["time", "time_guest_staff", "2 位客人，3 位接待人员，时长：1.5 小时，", 180],
  ["time", "time_guest", "2 位客人，时长：1.5 小时，", 60],
  ["time", "time_staff", "3 位接待人员，时长：1.5 小时，", 90],
  ["time", "time_only", "时长：1.5 小时，", 30],
  ["count", "count_guest", "2 位客人，", 20],
  ["count", "count_staff", "3 位接待人员，", 30],
];

for (const [kind, mode, details, amount] of cases) {
  test(`quote follows configured ${mode}`, () => {
    const core = coreFor(kind, mode);
    assert.equal(core.computeSale(sale).price, amount);
    assert.equal(core.quickReply(sale), `用户自定业务，${details}需支付 ${amount} 万。`);
  });
}

test("count quote includes the billed quantity", () => {
  const core = coreFor("count", "count_unit");
  assert.equal(core.quickReply(sale), "用户自定业务 ×4，需支付 40 万，感谢惠顾！");
});

test("custom quote uses the entered total", () => {
  const core = coreFor("custom", "total_share");
  assert.equal(core.quickReply(sale), "用户自定业务金额需支付 125 万，感谢惠顾！");
});

for (const mode of ["count_guest", "count_staff"]) {
  test(`quote honors record ${mode} over the current default`, () => {
    const core = coreFor("count", "count_unit");
    const record = { ...sale, billingMode: mode };
    const count = mode === "count_guest" ? 2 : 3;
    const noun = mode === "count_guest" ? "位客人" : "位接待人员";
    assert.equal(core.computeSale(record).price, count * 10);
    assert.equal(core.quickReply(record), `用户自定业务，${count} ${noun}，需支付 ${count * 10} 万。`);
  });
}

test("count override uses its own quantity and wording", () => {
  const core = coreFor("count", "count_guest");
  const record = { ...sale, billingMode: "count_unit" };
  assert.equal(core.quickReply(record), "用户自定业务 ×4，需支付 40 万，感谢惠顾！");
});

test("a single selected component uses its effective mode and quantity", () => {
  const core = coreFor("count", "count_unit");
  const record = { ...sale, items: [{ key: "quote", billingMode: "count_unit", giftCount: 7 }] };
  assert.equal(core.computeSale(record).price, 70);
  assert.equal(core.quickReply(record), "用户自定业务 ×7，需支付 70 万，感谢惠顾！");
});

test("a single selected component honors its guest-based mode", () => {
  const core = coreFor("count", "count_unit");
  const record = { ...sale, items: [{ key: "quote", billingMode: "count_guest", giftCount: 7 }] };
  assert.equal(core.computeSale(record).price, 20);
  assert.equal(core.quickReply(record), "用户自定业务，2 位客人，需支付 20 万。");
});
