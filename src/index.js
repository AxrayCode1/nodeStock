const express = require('express');


const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     if(req.method === 'GET') {

//     } else {
//         next();
//     } 
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currenctly done. Check back soon!');
// })

// app.use(express.json())
// app.use(userRouter);
// app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})
