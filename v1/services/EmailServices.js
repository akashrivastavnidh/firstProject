
const nodemailer = require("nodemailer");

let sendEmail = (email,otp) => {
    
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: "akashshrivastav534@gmail.com",
          pass: "aeqtpktczxxuxdlq"
        }
     });
    
     const mailOptions = {
        from: 'akashshrivastav534@gmail.com', 
        to: email, 
        subject: 'Node Mailer', 
        text: `verify opt for frogot password ${otp}`,
    };
    
    transport.sendMail(mailOptions, function(err, info) {
       if (err) {
         console.log(err)
       } else {
         console.log(info);
       }
    });
    }
    
    module.exports={
        sendEmail
    }