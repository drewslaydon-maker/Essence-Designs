import { runLabVerification } from "./src/lab/labChecks";

const { gates, overall } = runLabVerification();

console.log("");
console.log("=== LAB AIRSEAL VERIFICATION ===");
console.log("");
for (const g of gates) {
  console.log(`${g.pass ? "PASS" : "FAIL"}  ${g.title}`);
  for (const d of g.details) console.log(`      ${g.pass ? "·" : "!"} ${d}`);
}
console.log("");
console.log(
  overall
    ? "AIRSEALED. All gates green. No milestone may mark Verified without this exit code."
    : "LAB LEAK. One or more gates failed. Verification cannot be claimed.",
);
console.log("");
process.exit(overall ? 0 : 1);