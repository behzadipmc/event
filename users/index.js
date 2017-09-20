var User = require('./user');
var Users=function(){
    this.users=[];
    this.add=function (user) {
        var u = new User();
        u.id = user['id'];
        u.chanel = user['chanel'];
        u.status = user['status'];
        for(var index=0;index<this.users.length;index++){
            if(this.users[index].id===user.id)
            {
                this.users[index]=u;
                return;
            }
        }
        this.users.push(u);
    };
    this.remove=function (user) {
        var user_id=user;
        if(typeof user != typeof 1)
            user_id = user.id;
        for(var index=0;index<this.users.length;index++){
            if(this.users[index].id===user_id)
            {
                this.users.splice(index,1);
                break;
            }
        }
    };
    this.get_list=function () {
        var us=[];
        for(var index=0;index<this.users.length;index++){
            us.push({id:this.users[index].id , token : this.users[index].chanel, status : this.users[index].status});
        }
        return us;
    };
    this.find=function (id) { 
        for(var index=0;index<this.users.length;index++){
            if(this.users[index].id == id)
            { 
                return this.users[index];
            }
        }
        return null;
    };
    this.active = function (id) {
        for(var index=0;index<this.users.length;index++){
            if(this.users[index].id == id)
            {
                this.users[index].status='active';
                break;
            }
        }
    }
};
module.exports=function(){
    return new Users();
};        

