import axios from 'axios';
import { sendSuccess, sendError } from '../../utils/response.js';
export class GstVerifyController {
    static async verifyGST(req, res) {
        try {
            const { gst } = req.body;
            if (!gst)
                return sendError(res, 'GST number is required', 400);
            const response = await axios.get("https://appyflow.in/api/verifyGST", {
                params: { gstNo: gst, key_secret: `DMJJGvzKdChGcugTVQJjH4yG65O2` },
                timeout: 10000
            });
            // Return exact format that autoinn frontend expects
            return res.json({
                code: 200,
                response: {
                    code: 200,
                    message: "GST verified",
                    data: { data: response.data }
                }
            });
        }
        catch (error) {
            console.error('GST verification error:', error);
            // Handle API errors like autoinn does
            if (error.response?.status === 400) {
                return res.json({
                    code: 400,
                    message: "error GST No",
                    data: error
                });
            }
            else {
                return res.json({
                    code: 500,
                    msg: "An error occured"
                });
            }
        }
    }
}
//# sourceMappingURL=gstVerify.controller.js.map