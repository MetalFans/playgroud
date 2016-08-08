setInterval(fbLiker,10000);

function fbLiker(){
	var a=[];
	var uid = require("CurrentUserInitialData")["ACCOUNT_ID"];
	var dtsg = document.getElementsByName('fb_dtsg')[0].value.split(':')[0];
	var links = document.querySelectorAll('._2x4v');
	for(var i=0;i<links.length;i++){
		a[i]=links[i].href;
		if(a[i].indexOf('identifier')>-1){
			a[i]=a[i].substring(a[i].indexOf('identifier')+11,a[i].indexOf('&'));
			like(a[i],uid,dtsg);
		}
	}
	function like(id,uid,dtsg){
		var url = "https://www.facebook.com/ufi/reaction/?dpr=2";
		var request = "client_id=1461156001019%3A4262602184&ft_ent_identifier="+id+"&reaction_type=1&root_id=u_ps_0_0_8&session_id=7434400d&source=1&av="+uid+"&ft[tn]=]&ft[qid]=6275616298338861962&ft[mf_story_key]=-4018099560809889059&ft[fbfeed_location]=1&ft[insertion_position]=0&__user="+uid+"&__a=1&__dyn=aKhoFeyfyGm985A9UoGya4A5ERaUK5EK8GAEG8zQC-C26m5-9V8CdwIhEy9AgDxubxu7UaqwJzk7R88VEixvrzHzd4KuEjK5o8olDglwCDDBBzopK4VqCzEbe5V8O49Elxp1G229x2m&__req=u&__be=0&__pc=EXP1%3ADEFAULT&fb_dtsg="+dtsg+"%3AAQFJUUccL59_&ttstamp=265817185117100491054972875058658170748585999976535795&__rev=2294676";
		var x = new XMLHttpRequest();
		x.open("POST",url,true);
		x.send(request);
		window.scrollTo(0, document.body.scrollHeight);
	}
}