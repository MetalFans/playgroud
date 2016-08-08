Array.prototype.diff = function(a) {
	return this.filter(function(i) {return a.indexOf(i) < 0;});
};

window.addEventListener('load',doFirst,false);

function doFirst(){
	document.getElementById('myFile').onchange = fileChange;
	document.getElementById('button').disabled = true;
}

function fileChange(){
	var file = document.getElementById('myFile').files[0];
	var fileReader = new FileReader();
	fileReader.readAsText(file);
	fileReader.onload = function(){
		var csv = fileReader.result;
		processData(csv);
	};
}

function processData(csv) {
	var allTextLines = csv.split(/\r\n|\n/);
	var allData = [];
	for (var i=0; i<allTextLines.length; i++) {
		var data = allTextLines[i].split(',');
		var tarr = [];
			for (var j=0; j<data.length; j++) {
				if(data[j]!=""){
					tarr.push(data[j]);
				}else{
					break;
				}
			}
		allData.push(tarr);
	}
	var button = document.getElementById('button');
	var input = document.getElementById('input').value;
	button.disabled= false;
	button.onclick = function(){
		var big = document.getElementsByClassName('big');
		var fixed = document.getElementsByClassName('fixed');
		var table = document.getElementById('table');
		var input = document.getElementById('input').value;
		var head = document.getElementById('head');
		var wtf = document.getElementById('wtf');
		var sample = document.getElementById('sample');
		var swag = document.getElementById('swag');
		wtf.style.display='none';
		sample.style.display='none';
		swag.style.display='none';
		for(var i=0;i<big.length;i++){
			big[i].width = '30%';
		}
		while(table.hasChildNodes()){
			table.removeChild(table.childNodes[0]);
		}
		if(input<=0||input>=1||parseInt(input)!=0){
			alert("輸入大於0、小於1之數字");
		}else{
			head.children[0].innerHTML='若...';
			head.children[1].innerHTML='則...';
			head.children[2].innerHTML='支持度';
			head.children[3].innerHTML='信賴度';
			head.children[4].innerHTML='增益值';
			apriori(allData,input);
		}
	}
}

function apriori(allData,s){
	var d = new Date();
	var start = d.getTime();
	var highList = [];
	var items = [];
	var list = [];
	var support = s;
	var count0 = [];
	for(var i=0;i<allData[0].length;i++){
		if(count(i)/(allData.length-1)>=support){
			items.push(allData[0][i]);
			highList.push(allData[0][i]);
			count0.push(count(i));
		}
	}
	var strrs =items.toString().split(",");

	while(true){
		var countAll=[];
		if(strrs[0].indexOf(',')>-1){
			for(var i=0;i<strrs.length;i++){
				strrs[i]=strrs[i].toString().split(',');
			}
			var tempEnd=0;
			var tempStart=0;
			var tempS=[];
			for(var i=0;i<strrs.length-1;i++){
				if(arraysEqual(strrs[i].slice(0,strrs[i].length>1?strrs[i].length-1:1),strrs[i+1].slice(0,strrs[i].length>1?strrs[i].length-1:1))){
					tempEnd++;
				}else{
					if(tempEnd>tempStart){
						tempS.push(strrs.slice(tempStart,tempEnd+1));
					}
					tempStart=tempEnd+1;
					tempEnd=tempStart;
				}
			}
			var templist = [];
			for(var i=0;i<tempS.length;i++){
				tempS[i] = combinations(tempS[i], 2);
				for(var j=0;j<tempS[i].length;j++){
					tempS[i][j] = uniqueA(tempS[i][j]).sort();
				}
				tempS[i] = uniqueA(tempS[i]);
			}
			for(var i=0;i<tempS.length;i++){
				for(var j=0;j<tempS[i].length;j++){
					templist.push(tempS[i][j]);
				}
			}
			list=templist;
		}else{
			list = combinations(strrs, 2);
			for(var i=0;i<list.length;i++){
				list[i]=unique(list[i]);
			}
		}
		var temp = [];
		for(var c=0;c<list.length;c++){
			var countlist = scan(list[c],allData);
			if(checkHigh(list[c],highList)&&countlist/(allData.length-1)>=support){
				temp.push(list[c].toString());
				countAll.push(countlist);
				highList.push(list[c]);
			}
		}
		if(temp.length<1){
			break;
		}
		strrs=temp;
		confidence(strrs);
	}
	if(highList[highList.length-1].toString().split(',').length<=1){
		var swag = document.getElementById('swag');
		swag.style.display='initial';
	}
	var dd = new Date();
	var end = dd.getTime();
	console.log('運算時間： '+(end-start)+' ms');

	function checkHigh(e,array){
		var e2 = e.toString().split(',').slice();
		var exp = [];
		if(e2.length>1){
			for(var i=1;i<e2.length;i++){
				exp.push(combinations(e2,i));
			}
		}
		for(var i=0;i<exp.length;i++){
			for(var j=0;j<exp[i].length;j++){
				if(check(exp[i][j],array)){
					return false;
				}	
			}		
		}
		return true;
	}

	function scan(list,allData){
		var countlist = 0;
		for(var row=1;row<allData.length;row++){
			for(var i=0;i<list.length;i++){
				var flag=1;
				var index = allData[0].indexOf(list[i]);
				if(allData[row][index]!=1){
					flag=0;
					break;
				}
			}
			countlist+=flag;
		}
		return countlist
	}

	function count(i){
		var total = 0;
		for(var k=1;k<allData.length;k++){
			total += parseInt(allData[k][i]);
		}
		return total;
	}

	function combinations(arr, num) {
        var r = [];
        (function f(t, a, n) {
            if (n == 0) return r.push(t);
            for (var i = 0, l = a.length; i <= l - n; i++) {
                f(t.concat(a[i]), a.slice(i + 1), n - 1);
            }
        })([], arr, num);
        return r;
    }

	function unique(array){
		var n = [];
		for(var i = 0; i < array.length; i++){
	    	if (n.indexOf(array[i]) == -1) n.push(array[i]);
		}
		return n;
	}

	function uniqueA(array){
		var n = [];
		for(var i = 0; i < array.length; i++){
	    	if (check(array[i],n)) n.push(array[i]);
		}
		return n;
	}

	function check(e,array){
		var flag = true;
		if(e.toString().split(',').length>1){
			for(var i=0;i<array.length;i++){
				if(arraysEqual(e,array[i])){
					flag = false;
					break;
				}
			}
		}else{
			if(array.indexOf(e.toString())>-1){
				flag = false;	
			}
		}
		return flag;
	}

	function arraysEqual(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;
		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	function confidence(strrs){
		var st = strrs.slice();
		for(var i=0;i<st.length;i++){
			st[i]=st[i].toString().split(',');
		}
		var c = comAll(st,1);
		var p3 = [];
		for(var i=0;i<c.length;i++){
			var p2 = [];
			for(var j=0;j<c[i].length;j++){
				var p = []
				for(var k=0;k<c[i][j].length;k++){
					p.push(scan(c[i][j][k],allData)/(allData.length-1));
				}
				p2.push(p);
			}
			p3.push(p2);
		}
		var table = searchFriend(c,st,p3);

	}

	function comAll(strrs,adj){
		var all =[];
		for(var cl=0;cl<strrs.length;cl++){
			var c =[];
			if(strrs[cl].length>1){
				for(var i=1-adj;i<strrs[cl].length;i++){
					c.push(combinations(strrs[cl],i+adj));
				}
			}
			all.push(c);
		}
		return all;
	}

	function searchFriend(x,strrs,p){
		var t1 = [];
		for(var i=x.length-1;i>=0;i--){
			var t2 = [];
			for(var j=x[i].length-1;j>=0;j--){
				var t3 = [];
				for(var k=x[i][j].length-1;k>=0;k--){
					var tx = x[i][j][k].slice();
					var minus = strrs[i].diff(x[i][j][k]);
					var number = scan(strrs[i],allData);
					var su = number/(allData.length-1);
					var prf = p[i][j][k];
					var prb = searchP(minus,x,p);
					var prall = searchP(strrs[i],x,p);
					var con = prall/prf;
					var ef = con/prb;
					if(tx.length<strrs[i].length){
						createTable(tx,minus,su.toFixed(2),con.toFixed(2),ef.toFixed(2));
					}else{
						createTable(tx,'','','','');
					}
					tx.push(strrs[i].diff(x[i][j][k]),prall/prf,prall/prf/prb);
					t3.push(tx);
				}
				t2.push(t3);
			}
			t1.push(t2);
		}
		return t1;			
	}

	function searchP(x,c,p){
		for(var i=0;i<c.length;i++){
			for(var j=0;j<c[i].length;j++){
				for(var k=0;k<c[i][j].length;k++){
					if(arraysEqual(x,c[i][j][k])){
						return p[i][j][k];
					}
				}
			}
		}
	}

}

function createTable(p,q,sup,conf,eff){
	var cal = p.toString().length;
	var table = document.getElementById('table');
	var head = document.getElementById('head');
	var list = document.createElement('tr');
	list.className = 'content';
	if(q==''){
		list.style.height = '40px';
		list.style.font = 'bold 16px arial';
		list.style.textShadow = '1px 1px #eee';
	}

	var pContent = document.createElement('td');
	pContent.width='30%';
	pContent.innerHTML=p;
	list.appendChild(pContent);

	var qContent = document.createElement('td');
	qContent.width='30%';
	qContent.innerHTML=q;
	list.appendChild(qContent);

	var supContent = document.createElement('td');
	supContent.innerHTML=sup;
	list.appendChild(supContent);

	var confContent = document.createElement('td');
	confContent.innerHTML=conf;
	list.appendChild(confContent);

	var effContent = document.createElement('td');
	effContent.innerHTML=eff;
	list.appendChild(effContent);

	table.appendChild(list);

}
