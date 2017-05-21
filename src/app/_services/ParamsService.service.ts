export class ParamsService {
	public members;

	constructor() {}

	public saveMembers(members) {
		localStorage.setItem("members", JSON.stringify(members));
	}

	public getMembers() {
		return JSON.parse(localStorage.getItem("members"));
	}

	public saveChannel(channel) {
		localStorage.setItem("channel", JSON.stringify(channel));
	}

	public getChannel(){
		return JSON.parse(localStorage.getItem("channel"));
	}


}