import serviceService from "../services/serviceService.js";
import { OverallError } from "../errors/orderSaveError.js";
class ServiceController {
    async findService(req, res, next) {
        try {
            const { id } = req.params;
            if (isNaN(Number(id))) {
                throw new OverallError("سرویسی وجود ندارد");
            }
            res.status(200).json(await serviceService.findServiceById(Number(id)));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new ServiceController();
