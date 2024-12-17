const {SENDGRID_API_KEY , SENDGRID_MAIL} = require('../../config/env.js');
const nodemailer =  require('nodemailer');
const fs = require('fs');
const path = require('path');
const logger = require('log4js').getLogger('node.mailer')

const MAIL_CONFIG = {
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, 
    auth: {
      user: 'apikey',
      pass:SENDGRID_API_KEY,
    },
};

const tranporter = nodemailer.createTransport(MAIL_CONFIG);

async function SendMail({email , otp  , purpose}){
    try{
        let htmlTemplate= '';
        let subject = '';

        switch(purpose){
            case 'signup':
                 const emailOtpPath = path.join(__dirname , '../view/emailOtp.html');
                 htmlTemplate = fs.readFileSync(emailOtpPath,'utf8');
                 htmlTemplate = htmlTemplate.replace('{{email}}', email);
                 htmlTemplate = htmlTemplate.replace('{{otp}}', otp);
                 subject:'Verify Your Email Address Otp';
                 break;
            case 'forgotpassword':
                const emailForgetPath = path.join(__dirname , '../view/forgotPassword.html');
                htmlTemplate = fs.readFileSync(emailForgetPath , 'utf8')
                htmlTemplate = htmlTemplate.replace('{{email}}', email);
                htmlTemplate = htmlTemplate.replace('{{otp}}', otp);
                subject:'Reset Your OTP password';
                break;

            default:
                logger.error('Invalid Email Purpose')
            }

        const mailOptions = {
            from :SENDGRID_MAIL,
            to:email,
            subject:subject,
            html:htmlTemplate
        }

        const info  = await tranporter.sendMail(mailOptions);

        logger.info("Email Send Successfully", info.messageId);

    }catch(error){
        logger.error('Error in SendMail',error)
    }
}

module.exports = {SendMail}
  


