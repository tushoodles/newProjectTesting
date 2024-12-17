const cron = require('node-cron');
const { HTTPException } = require('../error/errorHTTPException');
const errorCodes = require('../error/error.Types');

function UpdateDateBase(){
    try{
        const val = true;
        if(val){
            throw new HTTPException(
                errorCodes.FORBIDDEN.status,
                errorCodes.FORBIDDEN.message,
            )
        }
    }catch(error){
        throw error;
    }
}


function CronJobTaks() {
    cron.schedule('* */2 * * * *', async() => {
        await UpdateDateBase();
    }); 
}

module.exports = { CronJobTaks}