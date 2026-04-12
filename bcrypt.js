import bcrypt from "bcrypt";

const match = await bcrypt.compare(
    "Chand@208",
    "$2a$10$bkScCTHRdvb/CmrQU6LIGuYaATLVytxsrxrqmBWZLXikbpbV2IheO"
);

console.log("MATCH:", match);