var express = require('express');
var axios = require('axios');
var router = express.Router();

router.post('/', (req, res) => {
    var destination = req.body.find(p=>p.name=='cus_des');
    destination = destination.value.replace(/ /g,'+') + '+Ho+Chi+Minh';
    axios.get('https://geocoder.api.here.com/6.2/geocode.json?app_id=gDzN0nMCji5lof7dXffC&app_code=LTEbJMPNijbdRxULdUrFmg&searchtext='+destination).then(response=>{
        destination =  response.data.Response.View[0].Result[0].Location.NavigationPosition[0];
        console.log(destination);
        res.json(destination);
    })
    
    
})
module.exports = router;