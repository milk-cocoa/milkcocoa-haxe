package ;

import milkcocoa.MilkCocoa;
import milkcocoa.DataStore;
import milkcocoa.Query;

class Sample{
	public static function main(){
		var milkcocoa = new MilkCocoa("https://io-sample.mlkcca.com/");
		var dataStore : DataStore = milkcocoa.dataStore("root");

	}
}