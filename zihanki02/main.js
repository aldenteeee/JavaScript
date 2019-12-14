"use strict";

//id部分の宣言
var in_zihanki = document.getElementById("in_zihanki");
var pocket_coins = document.getElementById("pocket_coins");

//自販機内の金額と初期化
var stored_value = 0;
in_zihanki.value = stored_value;

//商品の在庫、初期化
let stored_goods = new Map();
  stored_goods.set("cola", 3);
  stored_goods.set("greentea", 3);
  stored_goods.set("water", 3);

//自販機内の硬貨枚数、初期化
let stored_coins = new Map();
  stored_coins.set("10yen", 10);
  stored_coins.set("50yen", 100);
  stored_coins.set("100yen", 100);
  stored_coins.set("500yen", 100);
  stored_coins.set("1000yen", 100);

//硬貨の金額、初期化
let value_coins = new Map();
  for(let key of stored_coins.keys()){
    value_coins.set(key, parseInt(key.replace(/yen/g, "")));
  }

//商品の値段、初期化
let value_goods = new Map();
  value_goods.set("cola", 150);
  value_goods.set("greentea", 130);
  value_goods.set("water", 100);

//商品ボタンの設定、商品の在庫
for(let [key, value] of stored_goods){
  var $goods = document.getElementsByClassName(key);
  $goods[0].value = key+value_goods.get(key);
  $goods[1].innerHTML = value;
  $goods[0].addEventListener("click", function(){
    if(stored_value < value_goods.get(key)){
      wr_log("error", key);
    }else if(stored_goods.get(key) <= 0){
      wr_log("empty", key);
    }else {
      buy(key);
    }
  });
}
//コインのボタンの設定、残り枚数
for(let [key, value] of stored_coins){
  var $coins = document.getElementsByClassName(key);
  $coins[0].value = value_coins.get(key);
  $coins[1].innerHTML = value;
  $coins[0].addEventListener("click", function(){
    put(key);
    wr_log("put", key);
  });
}

//[1000,500,100,50,10]となる配列(割り算用)
var value_ary=[];
for(let value of value_coins.values()){
  value_ary.push(value);
}
value_ary.reverse();

//resetボタンの設定
document.getElementsByClassName("reset")[0].addEventListener("click", function(){
    for(let i=0; i<value_ary.length; i++){
      var quot = Math.floor(stored_value/value_ary.slice(i, i+1))
      var key = value_ary.slice(i, i+1)+"yen";
      stored_coins.set(key, stored_coins.get(key)-quot);
      document.getElementsByClassName(key)[1].innerHTML = stored_coins.get(key);
      stored_value -= quot*value_ary.slice(i, i+1);
    }
    wr_log("reset", "");
    stored_value = 0;
  });

//購入関数
function buy(key){
  if(check(key)==="success"){
    var $goods = document.getElementsByClassName(key);
    $goods[1].innerHTML = stored_goods.get(key)-1;
    stored_goods.set(key, stored_goods.get(key)-1);
    stored_value -= value_goods.get(key);
    in_zihanki.value = stored_value;
    wr_log("buy", key);
  }else{
    wr_log("change", "");
  }
}
//コイン投入関数
function put(key){
  var $coins = document.getElementsByClassName(key);
  $coins[1].innerHTML = stored_coins.get(key)+1;
  stored_coins.set(key, stored_coins.get(key)+1);
  stored_value += value_coins.get(key);
  in_zihanki.value = stored_value;
}
//ログ表示関数
function wr_log(act, key){
  var message = "error";
  switch(act){
    case "buy":
      message = "\nyou bought a " + key;
      document.log.text_log.value += message;
      break;
    case "put":
      message = "\nyou put " + key;
      document.log.text_log.value += message;
      break;
    case "error":
      document.log.text_log.value += "\nNot enough money";
      break;
    case "empty":
      document.log.text_log.value += "\nNot enough goods";
      break;
    case "reset":
      document.log.text_log.value += "\nThank you";
      break;
    case "change":
      document.log.text_log.value += "\nNot enough changes";
  }
  document.log.text_log.focus();
}

//在庫補充ボタンの設定
document.getElementById("replanishment").onclick = function(){
  for(let key of stored_goods.keys()){
    stored_goods.set(key, 10);
    document.getElementsByClassName(key)[1].innerHTML = stored_goods.get(key);
  }
};

  //購入時に自販機内に残る金額でお釣りが出せないなら購入を拒否
function check(key){
  let temp_stored_value = stored_value - value_goods.get(key);
  for(let i=0; i<value_ary.length; i++){
    var num = Math.floor(temp_stored_value/value_ary.slice(i, i+1));
    var key = value_ary.slice(i, i+1)+"yen";
    var temp_num = stored_coins.get(key) -num;
    if(temp_num <0){
      return;
    }
    temp_stored_value -= num*value_ary.slice(i, i+1);
  }
  return "success";
}
