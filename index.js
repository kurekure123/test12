const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();


//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//body paser Middleware
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));


app.get('/', (req, res)=>{
    res.render('contact');
});

app.post('/send', (req, res)=>{
   const output = `
    <p>You have a new contact request</p>
    <h3>Contact Detail</h3>
    <ul>
        <li>Email : ${req.body.email}</li>
        <li>Name : ${req.body.name}</li>
    </ul>
   `;

     // create reusable transporter object using the default SMTP transport
     let transporter = nodemailer.createTransport({
        host: 'kurekure123.naver.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'kurekure123@naver.com', // generated ethereal user
            pass: '12132' // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <kurekure123@naver.com>', // sender address
        to: 'kurekure900219@gmail.com', // list of receivers
        subject: 'Node Contact Request✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg:'email has been sent'})
    });
});

app.listen(3000, ()=>console.log('server started'));