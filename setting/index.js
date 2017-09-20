var setting_instance=null;
var Setting=function(){
    this.password='123';
    this.auth_url='http://parsian-demo.ir/core/api/home/account/excerpt';
};
module.exports=function(){
    if(setting_instance === null)
        setting_instance = new Setting();
    return setting_instance;
};
