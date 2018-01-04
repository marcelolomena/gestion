  
    const nodemailer = require('nodemailer');
    
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'marcelo.mlomena@gmail.com', // generated ethereal user
            pass: '123momiaes'  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"ALERTA LIC 👻" <jcastro@zrismart.cl>', // sender address
        to: 'jcastro@zrismart.cl, marcelol@loso.cl, ricreyesman@gmail.com', // list of receivers
        subject: 'Alarma 🚨', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>EMOXX?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
