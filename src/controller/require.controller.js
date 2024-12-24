const requireService = require('../service/require.service');


class requireController{
    constructor(){
        this.requireservice = new requireService();
    }

    async giveApproveMember(req,res, next){
        try{
            const approveDetail = {
                data:req.body,
                user:req.user
            };

            const result = await this.requireservice.getapprovemember(approveDetail);

        }catch(error){
            next(error)
        }
    }

}
module.exports = requireController;