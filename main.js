// 麻雀のメイン関数

yama = new Array(136); //山
img = {}; //牌IDに対応する画像
tehai = new Array(14); //手牌
junme = 0; //順目
kawa = new Array(0); //川

Array.prototype.shuffle = function() {
    var i = this.length;
    while(i){
	var j = Math.floor(Math.random()*i);
	var t = this[--i];
	this[i] = this[j];
	this[j] = t;
    }
    return this;
};

//jquery
$(document).ready(function(){
	//クリックされた牌を交換
	$(document).on("click", ".hai", function(){
		change($(this).attr("id"));
		$("#machi").remove();
	});
	//ホバーされた牌をスライドさせる
	$(document).on("mouseover", ".hai", function(){
       		$(this).stop().animate({"width":"60px"},'fast');
		machi($(this).attr("id"));　//待ちを表示
	});
	$(document).on("mouseout", ".hai", function(){
		$(this).stop().animate({'width':'47px'},'fast');
		$("#machi").remove();
	});
});

//画像の対応付け
function setImg(){
    //マンズ、ピンズ、ソーズ
    for(var i=0; i<9; i++){
	img[i+1] = "p_ms" + String(i+1) + "_1.gif"; //マンズ
	img[i+1+10] = "p_ps" + String(i+1) + "_1.gif"; //ピンズ
	img[i+1+20] = "p_ss" + String(i+1) + "_1.gif"; //ソーズ
    }

    //字牌
    var tuhai = new Array("p_ji_e_1.gif","p_ji_s_1.gif","p_ji_w_1.gif","p_ji_n_1.gif","p_no_1.gif","p_ji_h_1.gif","p_ji_c_1.gif");
    for(var i=0; i<7; i++){
	img[i+1+30] = tuhai[i];
    }
}

//山の生成
function setYama(){
    //マンズ、ピンズ、ソーズ、字牌
    for(var i=0; i<9; i++){
	for(var j=0; j<4; j++){
	    yama[i*4+j] = i+1; //マンズ
	    yama[i*4+j+36] = i+1+10; //ピンズ
	    yama[i*4+j+72] = i+1+20; //ソーズ
	    if(i<7) yama[i*4+j+108] = i+1+30; //字牌
	}
    }

    yama.shuffle();
}

//配牌を用意する関数
function setHaipai() {
    tehai_tmp = new Array(13);
    for(var i=0; i<13; i++){
	tehai_tmp[i] = yama.pop();
    }
    
    tehai_tmp.sort(function(a, b) {
	    return (parseInt(a) > parseInt(b)) ? 1 : -1;
    });
    tehai_tmp.push(yama.pop());
    tehai = tehai_tmp;
    //    tehai = [1,1,1,1,2,2,3,3,7,7,8,8,9,9]; //積み込み
    
    show();
};

//手牌を表示
function setTehai(){
    view = document.getElementById("view");
    
    try{
	while(view.firstChild){
	    view.removeChild(view.firstChild);
	}
    }catch(e){}

    for(var i=0; i<14; i++){
	var hai = document.createElement("img");
	hai.setAttribute("src","./hai/" + img[tehai[i]]);
	hai.setAttribute("class","hai");
	hai.setAttribute("id",String(i));
	if(i==13) hai.setAttribute("hspace",10);
	view.appendChild(hai);
    }
    Tsumo(tehai);
}

//手牌を変更
function change(index){
    kawa.push(tehai[parseInt(index)]);
    tehai.splice(parseInt(index),1);
    tehai.sort(function(a,b) {
	    return (parseInt(a) > parseInt(b)) ? 1 : -1;
    });
    tehai.push(yama.pop());

    show();
}

//川に牌を追加
function setKawa(){
    div_kawa = document.getElementById("kawa");
    hai = document.createElement("img");
    hai.setAttribute("src", "./hai/" + img[kawa[kawa.length-1]]);
    div_kawa.appendChild(hai);
}

//ドラ表示牌を指定
function setDora(){
    div_dora = document.getElementById("dora");
    hai = document.createElement("img");
    hai.setAttribute("src","./hai/" + img[yama[13]]);
    div_dora.appendChild(hai);
}

//全ての変更を反映し、表示
function show(){
    junme++;
    div_junme = document.getElementById("junme");
    div_junme.innerText = String(junme) + "順目";
    div_yama = document.getElementById("yama");
    div_yama.innerText = "残り" + String(yama.length-14) + "枚";
    setTehai();
    if(junme>1){
	setKawa();
    }else{
	setDora();
    }
}

//手牌から1牌を除いた際の待ちを調べる
function machi(id){
    hai = tehai.slice(0);
    hai.splice(parseInt(id),1);

    kind = new Array(38);
    for(var i=0; i<kind.length; i++){
	kind[i] = 0; //初期化
    } 

    for(var i=0; i<hai.length; i++){
	kind[hai[i]] += 1;
    }

    candidates = [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38]; //上がり牌候補
    elected = [];

    for(var i=0; i<candidates.length; i++){
	hai.push(candidates[i]);
	if(Tsumo(hai) > 0) elected.push(candidates[i]) 
	hai.pop();
    }

    //待ち牌を表示(jquery)
    showMachi(elected,id);

    //待ち牌を表示
    /*for(var i=0; i<elected.length; i++){
	newImg = document.createElement("img");
	newImg.setAttribute("src","./hai/" + img[elected[i]]);
	view = document.getElementById("view");
	view.appendChild(newImg);
	}*/
};

//待ち牌を表示
function showMachi(machi,id){
    hovered = $("#"+id); //ホバーされている牌を取得
    var div = $("<div/>").attr("id","machi");
    div.css("position","absolute");
    div.css("left",300);
    div.css("top",300);

    
    for(var i=0; i<machi.length; i++){
	newImg = $("<img/>").attr("src","./hai/"+img[machi[i]]);
	div.append(newImg);
    }

    $("body").append(div);
}

//牌の種類でわかる役かをチェック
function yaku_by_array(kind, array, yaku){
    for(var i=0; i<kind.length; i++){
        if(array.indexOf(i) == -1 && kind[i] > 0) return ""
            }
    return yaku;
};

//役の判定
function yaku_check(M, kind){
    yaku = "";
    
    //牌の種類だけで判別できるものを列挙
    tsu_i_so = [31,32,33,34,35,36,37]; //字一色
    chinroto = [1,9,11,19,21,29]; //清老頭
    honroto = [1,9,11,19,21,29,31,32,33,34,35,36,37]; //混老頭
    ryu_i_so = [22,23,24,26,28,36] //緑一色
    tanyao = [2,3,4,5,6,7,8,12,13,14,15,16,17,18,22,23,24,25,26,27,28]; //タンヤオ
    
    //kindから役を求める
    yaku += yaku_by_array(kind, tsu_i_so, "字一色 ");
    yaku += yaku_by_array(kind, chinroto, "清老頭 ");
    if(yaku == "") yaku += yaku_by_array(kind, honroto, "混老頭 ");
    yaku += yaku_by_array(kind, ryu_i_so, "緑一色 ");
    yaku += yaku_by_array(kind, tanyao, "断ヤオ九 ");
    
    //大三元
    if(kind[35] > 2 && kind[36] > 2 && kind[37] > 2){
	yaku += "大三元 ";
    }else if(kind[35] + kind[36] + kind[37] > 7){
	yaku += "小三元 ";
    }

    //四喜和
    if(kind[31] > 2 && kind[32] > 2 && kind[33] > 2 && kind[34] > 2){
	yaku += "大四喜 ";
    }else if(kind[31] + kind[32] + kind[33] + kind[34] > 10){
	yaku += "小四喜 ";
    }

    //役牌
    if(kind[35] > 2) yaku += "白 ";
    if(kind[36] > 2) yaku += "發 ";
    if(kind[37] > 2) yaku += "中 ";

    if(yaku != ""){
        view = document.getElementById("message");
        div = document.createElement("div");
        div.innerText = yaku;
        view.appendChild(div);
    }
};

agarikei = new Array(0); //上がり形を入れておく大域リスト

//上がり判定
function Tsumo(hai){
    kind = new Array(38); //牌ごとの枚数
    mpst = new Array(4); //種類ごとの枚数(マンピンソー字)

    for(var i=0; i<kind.length; i++){
	kind[i] = 0; //初期化
	if(i<4) mpst[i] = 0 //こっちも初期化
    }

    //手牌の種類別枚数を取得
    for(var i=0; i<hai.length; i++){
	kind[hai[i]] += 1;
	mpst[parseInt(hai[i]/10)] += 1;
    }
    
    //雀頭候補を取得
    head = [];
    for(var i=0; i<kind.length; i++){
	if(kind[i] > 1) head.push(i); 
    }

    //雀頭以外が上がり形になっているか調べる
    for(var i=0; i<head.length; i++){
	tmp = mpst.slice(0); //コピー
	tmp[parseInt(head[i]/10)] -= 2;
	if((tmp[0]%3)+(tmp[1]%3)+(tmp[2]%3)+(tmp[3]%3)==0){
	    tmp = kind.slice(0); //コピー
	    tmp[head[i]] -= 2;

	    //アタマ以外の部分を調べる
	    mentu(tmp,String(head[i])+"*2 ",kind);
	}
    }
    
    //あとで考える
    ret = agarikei.length;
    agarikei = new Array(0);
    return ret;
};

//上がり形になっているか再帰的に深さ優先探索で判定
//Sが探索していない牌、Mがメンツ候補
function mentu(S, M, kind){
    var rest = 0; //Sに含まれる牌の数
    for(var i=0; i<S.length; i++){
	if(S[i]>0 && rest==0){
	    rest += S[i];
	    if(S[i] > 2){
		S[i] -= 3; //3枚以上なら刻子候補として取り除く
		mentu(S, M + String(i)+"*3 ", kind);
		S[i] += 3; //元に戻す
	    }
	    if(i<30 && S[i]*S[i+1]*S[i+2]>0){ //字牌でなくシュンツ条件を満たすなら
		S[i]--; S[i+1]--; S[i+2]--; //シュンツ候補を取り除く
		mentu(S,M + String(i) + String(i+1) + String(i+2) + " ", kind);
		S[i]++; S[i+1]++; S[i+2]++; //元に戻す
	    }else{
		return 0; //どちらでもないならあがりでない
	    }
	}
    }
    if(rest==0){
	/*
	view = document.getElementById("message");
	div = document.createElement("div");
	div.innerText = M;
	view.appendChild(div);
	yaku_check(M, kind); //役の判定 */
	agarikei.push(M);
    }
};

//ボタンにイベントリスナを追加
function load() {
    setImg();
    setYama();
    setHaipai();
};

document.addEventListener("DOMContentLoaded", load, false);