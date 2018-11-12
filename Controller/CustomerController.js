var express = require('express');
var axios = require('axios');
var router = express.Router();
var customerRepos= require('../Repos/CustomerRepos');
var Diacritics = require('diacritic');

router.post('/', (req, res) => {
    var data = req.body;
    var destination = req.body.cus_des;
    destination = Diacritics.clean(destination);
    destination = destination.replace(/ /g,'+') + '+Ho+Chi+Minh';
    axios.get('https://geocoder.api.here.com/6.2/geocode.json?app_id=gDzN0nMCji5lof7dXffC&app_code=LTEbJMPNijbdRxULdUrFmg&searchtext='+destination).then(response=>{
        destination =  response.data.Response.View[0].Result[0].Location.NavigationPosition[0];
        customerRepos.saveInfo(data,destination).then(value=>{
            console.log(value);
        }).catch(err=>{
            console.log(err);
        })
        console.log(destination);
        res.json(destination);
    }).catch(err=>{
        console.log(err);
    })
    
    
})

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    return str;
}
module.exports = router;