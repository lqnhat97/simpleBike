var express = require('express');
axios = require('axios');
var router = express.Router();

router.post('/', (req, res) => {
    var data=req.body;
    var destination = data.find(p=>p.name=='cus_des');
    destination = destination.value.replace(' ','+') + 'Ho+Chi+Minh';
    axios.get('https://geocoder.api.here.com/6.2/geocode.json?app_id=gDzN0nMCji5lof7dXffC&app_code=LTEbJMPNijbdRxULdUrFmg&searchtext='+destination).then(res=>{
        this.destination =  res.data;
        console.log(destination);
    })
    
    res.json(destination);
})
module.exports = router;