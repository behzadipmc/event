var User=function(){
    this.id = -1;
    this.chanel = null;
    this.status = 'none';
    this.socket = null;
    this.fill = function fill(info) {
        this.id = info['id'];
        this.chanel = info['chanel'];
        this.status = info['status'];
    }
    this.token_validation = function (){
        
    };
};
module.exports=function(){
    return new User();
};                  