package ;

import milkcocoa.MilkCocoa;
import milkcocoa.DataStore;
import milkcocoa.Query;

class Main{
    public static function main(){
    	var milkcocoa = new MilkCocoa("");
    	var email = "";
    	var pass = "";
    	milkcocoa.addAccount(email,pass,{},function(err,data){
    		milkcocoa.login(email,pass,function(err,data){
    			milkcocoa.logout();
    		});
    	});
    }
}
