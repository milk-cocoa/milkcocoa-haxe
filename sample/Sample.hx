package;

import milkcocoa.Account;
import milkcocoa.DataStore;

class Sample{
	public static function main(){
		Account.sineUp("nobukazu@bar.com","nobunobu",null,function(e){
			Account.signIn("nobunobu@bar.com","nobukazu",function(e, account){
				trace(account);
				});
			});
	}
}