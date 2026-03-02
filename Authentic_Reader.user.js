// ==UserScript==
// @name        Authentic Reader
// @namespace        http://blog.ameba.jp
// @version        1.8
// @description        自動プログラムの時限フォローを判定する
// @author        Ameba Blog User
// @match        https://blog.ameba.jp/ucs/reader/readerlist.do*
// @match        https://blog.ameba.jp/ucs/blgfavorite/favoritelist.do*
// @match        https://blog.ameba.jp/block
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @grant        none
// @updateURL        https://github.com/personwritep/Authentic_Reader/raw/main/Authentic_Reader.user.js
// @downloadURL        https://github.com/personwritep/Authentic_Reader/raw/main/Authentic_Reader.user.js
// ==/UserScript==


let readers=[]; // フォロワー登録データ
let deleted_reader; // フォロワーリスト表示数とフォロワー履歴数の差
let UserID; // アメーバログインID



if(location.href.includes("ucs/blgfavorite/favoritelist.do") ||
   location.href.includes("ucs/reader/readerlist.do?page")){ // フォロワー管理共通

    control_panel_disp(1);
    to_block_disp();

    let mentenance=document.querySelector('.mentenance');
    if(mentenance){
        mentenance.onclick=()=>{
            location.href="https://blog.ameba.jp/ucs/reader/readerlist.do"; }}

} // フォロワー管理共通



if(location.href=="https://blog.ameba.jp/ucs/reader/readerlist.do"){ // フォロワー管理トップ

    control_panel_disp(0);
    to_block_disp();

    let amebaId=document.querySelector('.amebaId');
    if(amebaId){
        UserID=amebaId.textContent; }

    if(!UserID){
        alert(
            '⛔　======== Authentic Reader ========\n'+
            '　　ユーザーIDが取得出来ないため処理を実行できません\n'+
            '　　ページのリロードを試し、さらにアメーバのログインに問題\n'+
            '　　が無いかを確認してください'); }
    else{
        main(); }

} // フォロワー管理トップ



if(location.href=="https://blog.ameba.jp/block"){ // 管理 - 制限したブログ
    control_panel_disp(1);

    let mentenance=document.querySelector('.mentenance');
    if(mentenance){
        mentenance.onclick=()=>{
            location.href="https://blog.ameba.jp/ucs/reader/readerlist.do"; }}


    let retry=0;
    let interval=setInterval(wait_target, 200);
    function wait_target(){
        retry++;
        if(retry>10){ // リトライ制限 10回 2secまで
            clearInterval(interval); }
        let target=document.querySelector('.BlogWebBlock_next-button__OfEW6 button');
        if(target){
            target.click(); }}


    setTimeout(()=>{
        item_count_disp();

        let block_item=document.querySelectorAll('.BlogWebBlock_item__2YbpR');
        for(let k=0; k<block_item.length; k++){
            let href_row=block_item[k].querySelector('a').getAttribute('href');
            let id=href_row.split('/')[3];
            id='<span style="font: bold 16px Meiryo; color: #888; margin-left: 2em;">'+
                id +'</span>';
            let status=block_item[k].querySelector('.BlogWebBlock_status__66mul');
            status.insertAdjacentHTML('beforeend', id);

            let u_img=block_item[k].querySelector('img');
            if(u_img){
                if(u_img.src.includes('common/noimage')){
                    u_img.style.border='30px solid #000';
                    let button_w=block_item[k].querySelector('.BlogWebBlock_edit-button__S09HN');
                    let button=block_item[k].querySelector('.spui-Button');
                    if(button_w && button){
                        button_w.style.width='120px';
                        button.textContent='退会済　編集'; }}}

            block_item[k].onclick=function(event){
                event.preventDefault();
                for(let i=0; i<block_item.length; i++){
                    if(i==k){
                        block_item[i].setAttribute('contenteditable', 'true'); }
                    else{
                        block_item[i].setAttribute('contenteditable', 'false'); }}}
        }
    }, 2100);


    function item_count_disp(){
        let block_item=document.querySelectorAll('.BlogWebBlock_item__2YbpR');
        let breadc=document.querySelector('.spui-Breadcrumb');
        if(breadc){
            let count=
                '<span class="bwbcount">'+
                '<span class="count_txt">ブロック件数</span>'+ block_item.length +
                '<style>.bwbcount { position: absolute !important; top: 20px; right: 24px; '+
                'padding: 1px 6px 0 !important; height: 26px; border: 1px solid #aaa; } '+
                '.count_txt { font-size: 13px !important; margin-right: 10px; vertical-align: 1px; } '+
                '@media screen and (max-width: 768px){ .bwbcount { top: 8px; right: 2px; }}'+
                '</style></span>';
            if(!document.querySelector('.bwbcount')){
                breadc.insertAdjacentHTML('beforeend', count); }}
    } // item_count_disp()

} // 管理 - 制限したブログ



function control_panel_disp(n){
    let help_url='https://ameblo.jp/personwritep/entry-12794112842.html'

    let style=
        '#panel_AR { position: absolute; z-index: 1; top: 12px; right: 35px; '+
        'display: flex; align-items: center; '+
        'font: bold 16px/16px Meiryo; color: #666; background: #e0f0fd; '+
        'width: 330px; height: 30px; padding: 3px 0 1px 15px; '+
        'border: 1px solid #ccc; border-radius: 2px; } '+
        '#inner_AR1, #inner_AR2 { margin-bottom: 2px; } '+
        '.swe { font: normal 16px Meiryo; padding: 1px 6px 0; height: 28px; '+
        'margin-right: 12px; cursor: pointer; } '+
        '.swe1 { margin-left: -62px; } '+
        '.file_input { display: none; } '+
        '.data_disp { display: inline-block; width: 115px; height: 28px; '+
        'padding: 6px 6px 0; margin-right: 12px; box-sizing: border-box; '+
        'font: normal 16px/16px Meiryo; text-align: center; border: 1px solid #ccc; '+
        'color: #000; background: #fff; cursor: pointer; } '+
        '.swc { font: normal 16px Meiryo; padding: 1px 4px 0; height: 28px; } '+
        '.help_AR { margin: 0 45px -3px 12px; cursor: pointer; } '+
        '.setting_AR { margin: 0 0 -2px 4px; } '+
        '#inner_AR2 { display: none; } '+
        '.rdrCmnt .name { font-size: 0 !important; } ';

    let style_add=
        '#panel_AR { top: 54px; right: calc(50% - 518px); height: 36px; width: 345px; } '+
        '@media screen and (max-width: 1248px){ #panel_AR { right: calc(50% - 448px); }} '+
        '@media screen and (max-width: 1032px){ #panel_AR { right: 65px; }} '+
        '@media screen and (max-width: 768px){ #panel_AR { right: 16px; }} '+
        '.swe { color: #000; border: 1px solid #999; border-radius: 2px; '+
        'background: #f0f0f0; } '+
        '.swe:hover { filter: brightness(0.96); }';


    let SVG_h=
        '<svg class="help_AR" height="18" width="18" viewBox="0 0 150 150">'+
        '<path  d="M66 13C56 15 47 18 39 24C-12 60 18 146 82 137C92 '+
        '135 102 131 110 126C162 90 128 4 66 13M68 25C131 17 145 117 81 '+
        '125C16 133 3 34 68 25M69 40C61 41 39 58 58 61C66 63 73 47 82 57C84 '+
        '60 83 62 81 65C77 70 52 90 76 89C82 89 82 84 86 81C92 76 98 74 100 66'+
        'C105 48 84 37 69 40M70 94C58 99 66 118 78 112C90 107 82 89 70 94z">'+
        '</path></svg>';

    let SVG_g=
        '<svg class="setting_AR" height="16" width="16" viewBox="0 0 256 256">'+
        '<path d="M114 19C110 22 109 30 108 34C106 41 102 46 96 49C88 53 81 '+
        '52 73 48C69 46 63 41 58 42C53 43 49 49 46 52C44 54 41 56 40 59C38 6'+
        '4 44 69 46 73C50 82 52 90 47 99C42 107 35 109 27 112C23 113 18 114 '+
        '16 118C15 124 16 132 16 138C16 140 16 143 18 145C20 148 25 149 28 1'+
        '50C36 152 44 155 48 164C52 173 50 180 46 188C44 192 38 198 41 203C4'+
        '2 206 45 208 47 210C50 213 54 218 58 219C62 220 68 216 71 214C78 21'+
        '0 84 208 92 210C99 213 105 218 107 225C109 230 110 239 114 242C117 '+
        '244 123 243 126 243C130 243 138 244 141 241C146 238 146 229 148 224'+
        'C151 216 159 210 168 209C175 208 182 213 188 216C191 218 195 221 19'+
        '9 218C204 216 208 210 212 206C213 204 215 202 215 200C215 196 212 1'+
        '93 210 190C206 182 203 175 206 166C210 157 217 153 225 150C229 149 '+
        '237 148 239 143C240 137 239 129 239 123C239 121 239 118 237 116C235'+
        ' 113 229 112 226 111C218 108 210 105 207 96C203 86 206 80 210 71C21'+
        '2 68 215 65 215 61C215 59 213 57 212 55C208 51 204 45 199 43C195 40'+
        ' 191 43 188 45C181 48 174 54 166 52C158 50 151 45 148 37C146 32 146'+
        ' 22 141 19C137 17 129 18 125 18C122 18 117 17 114 19z" style="fill:'+
        '#000"></path>'+
        '<path d="M123 70C116 71 109 72 103 75C82 85 69 106 68 129C66 162 97'+
        ' 195 131 191C162 187 185 164 187 132C189 99 157 66 123 70z" style="'+
        'fill:#fff"></path></svg>';

    let panel=
        '<div id="panel_AR">'+
        '<div id="inner_AR1">'+
        'Authentic Reader<span>'+
        '<a href="'+ help_url +'" target="_blank" rel="noopener noreferrer">'+
        SVG_h +'</a></span>';

    if(n==0){
        panel+=
            '<button class="mentenance swe" type="submit" >Setting'+ SVG_g +'</button>'+
            '</div>'+
            '<div id="inner_AR2">'+
            '<input class="export swe" type="submit" value="Export">'+
            '<input class="import swe" type="submit" value="Import">'+
            '<input class="file_input" type="file">'+
            '<span class="data_disp">　</span>'+
            '<input class="close swc" type="submit" value="✖"></div>'; }

    else if(n==1){
        panel+=
            '<button class="mentenance swe swe1" type="submit" >Readers Top Page</button>'+
            '</div>'; }


    let panel_1=panel +'<style>'+ style +'</style></div>';
    let panel_2=panel +'<style>'+ style + style_add +'</style></div>';


    let ucsContent=document.querySelector('#ucsContent'); // フォロワー管理
    let __next=document.querySelector('#__next'); // 制限したブログの管理
    let panel_AR=document.querySelector('#panel_AR');
    if(ucsContent && !panel_AR){
        ucsContent.insertAdjacentHTML('beforeend', panel_1); }
    else if(__next && !panel_AR){
        __next.insertAdjacentHTML('beforeend', panel_2); }

} // control_panel_disp()



function to_block_disp(){
    let tab_header=document.querySelector('.tabContentHeader');
    let link=
        '<a class="to_blockdo" href="/block">▶ 制限したブログの管理</a>'+
        '<style>.to_blockdo { position: absolute; top: 6px; right: 220px; '+
        'cursor: pointer; }</style>';

    if(tab_header){
        if(!document.querySelector('.to_blockdo')){
            tab_header.insertAdjacentHTML('beforeend', link); }}

} // to_block_disp



function main(){
    function write_local(){
        let write_json=JSON.stringify(readers);
        localStorage.setItem('AR_'+UserID, write_json); } // ローカルストレージ 保存名

    let read_json=localStorage.getItem('AR_'+UserID); // ローカルストレージ 保存名
    readers=JSON.parse(read_json);
    if(readers==null){
        readers=[['name', '1990年time', '0']];
        write_local(); }


    control_panel(); // コントロールパネルの各種機能を実行
    check(); // フォロワー管理のトップページを開いた時にデータベースを更新
    disp_list(); // フォロワーリストで属性のカラー表示



    function control_panel(){
        let AR1=document.querySelector('#inner_AR1');
        let AR2=document.querySelector('#inner_AR2');
        let mentenance=document.querySelector('.mentenance');
        let data_disp=document.querySelector('.data_disp');
        let close=document.querySelector('.close');

        if(mentenance && AR1 && AR2){
            mentenance.onclick=function(){
                enter(AR1, AR2); }}

        if(data_disp && AR1 && AR2){
            data_disp.onclick=()=>{
                exit(AR1, AR2); }}

        if(close && AR1 && AR2){
            close.onclick=()=>{
                exit(AR1, AR2); }}

        function enter(AR1, AR2){
            AR1.style.display='none';
            AR2.style.display='block';
            database();
            disp_deleted_count();
            own_delete();
            AR_backup(); }

        function exit(AR1, AR2){
            AR1.style.display='block';
            AR2.style.display='none';
            database_close();
            disp_list();
            own_delete(); }
    } // control_panel()



    function check(){ // データベースの更新
        let table_tr=document.querySelectorAll('.tableList tbody tr');
        for(let k=0; k<table_tr.length; k++){
            let name=table_tr[k].querySelector('.name a').textContent;
            let time=table_tr[k].querySelector('.rdrCmnt span').textContent;

            let count=0;
            for(let i=0; i<readers.length; i++){
                if(name==readers[i][0]){
                    count+=1;
                    if(time!=readers[i][1]){ // 履歴と異なる日付データの場合
                        if(readers[i][2]=='0'){ // 再フォローの記録がない場合
                            readers[i][2]='1'; // 再フォローを記録
                            readers[i][3]=readers[i][1]; // 旧フォロー日付を保存 // 💢💢
                            readers[i][1]=time; // フォロー日付を今日に差換え
                            table_tr[k].style.background=set_color('1'); } // 再フォローを黄色表示
                        else if(readers[i][2]=='1'){ // 再フォローの記録がある場合（再再フォロー）
                            readers[i][2]='1'; // 再フォローを記録
                            readers[i][3]=readers[i][1]; // 旧フォロー日付を保存 // 💢💢
                            readers[i][1]=time; // フォロー日付を今日に差換え
                            table_tr[k].style.background='red'; } // 実際はset_color('1') の黄色表示
                        else if(readers[i][2]=='2'){ // こちらでフォロー削除
                            readers[i][3]=readers[i][1]; // 旧フォロー日付を保存 // 💢💢
                            readers[i][1]=time; // フォロー日付を今日に差換え
                            table_tr[k].style.background=set_color('2'); }}}} // set_color('2') 緑表示

            if(count==0){ // 同データが無い新しい登録
                readers.push([name, time, '0']); }}


        readers.sort((a, b)=>{
            return b[1].replace(/[^0-9]/g, '')*1 - a[1].replace(/[^0-9]/g, '')*1 });

        setTimeout(()=>{
            let now=new Date();
            let year=now.getFullYear()-1; // 1年前 🔴「-2」は2年前までになります
            let month=now.getMonth()+1;
            let date=now.getDate();
            let last_time=year*10000 + month*100 + date; // データの有効期限を1年とする
            readers=readers.filter(value=>{
                if(value[1].replace(/[^0-9]/g, '')*1 > last_time || value[2]=='1'){
                    return true; }});

            deleted_reader=deleted_count();
            write_local(); }, 500);
    } // check()



    function disp_list(){
        let table_tr=document.querySelectorAll('.tableList tbody tr');
        for(let k=0; k<table_tr.length; k++){
            let name=table_tr[k].querySelector('.name a').textContent;
            for(let i=0; i<readers.length; i++){
                if(name==readers[i][0]){
                    table_tr[k].style.background=set_color(readers[i][2]);
                    if(table_tr[k].classList.contains('history')){
                        if(readers[i][2]=='0'){
                            table_tr[k].style.background='#f5f8fa'; }} // 履歴のみは淡灰色の背景色

                    let date_now=table_tr[k].querySelector('.rdrCmnt span');
                    if(readers[i][3]){
                        let memo=
                            '<span class="old" style="margin-right: -45px">' + readers[i][3] +'<span>'; // 💢💢
                        if(!table_tr[k].querySelector('.rdrCmnt .old')){
                            date_now.insertAdjacentHTML('afterend', memo); }}}
            }
        }
    } // disp_list()



    function deleted_count(){ // フォロワーリスト数と履歴データ数の差をチェック
        let deleted=0; // チェック時にリセット
        for(let i=0; i<readers.length; i++){
            let table_tr=document.querySelectorAll('.tableList tbody tr');
            let live=0;
            for(let k=0; k<table_tr.length; k++){
                let name=table_tr[k].querySelector('.name a').textContent;
                if(readers[i][0]==name){
                    live+=1; }}
            if(live==0){
                deleted +=1; }}
        return deleted;
    } // deleted_count()


    function disp_deleted_count(){
        let data_disp=document.querySelector('#inner_AR2 .data_disp');
        if(data_disp){
            data_disp.textContent='hidden: '+ deleted_reader; }}



    function own_delete(){
        let table_tr=document.querySelectorAll('.tableList tbody tr');
        for(let k=0; k<table_tr.length; k++){
            let name=table_tr[k].querySelector('.name a').textContent;
            let btnDelete=table_tr[k].querySelector('.btnDelete');

            btnDelete.onmouseup=function(){
                let AppButton=document.querySelector('.minimumApplyButton a:first-child');
                if(AppButton){
                    AppButton.addEventListener('mouseup', function(){
                        set_2(name); }); }}}

        function set_2(name_){
            for(let i=0; i<readers.length; i++){
                if(name_==readers[i][0]){
                    if(readers[i][2]=='0'){ // フラグ無しフォロワーをユーザー側で削除した場合
                        readers[i][2]='2'; } // オウン削除のフラグを設定
                    write_local(); }}}
    } // own_delete()



    function database(){ // 履歴のみのフォロワーを追加して履歴編集環境にする
        disp_datalist();
        change_color();
        remove_data(); }



    function disp_datalist(){
        let thead_AR=
            '<span class="thead_AR">履歴属性'+
            '<style>'+
            '.tableList thead .closeRow { padding: 6px 124px 4px 20px; } '+
            '.tableList .thead_AR { margin-left: 55px; } '+
            '.tableList .rdrCmnt p { width: 400px; } '+
            '.tableList tbody .closeRow { position: relative; width: 140px !important; '+
            ' box-shadow: none !important; } '+
            '.tableList .color.btn { position: absolute; top: 19px; left: 120px; '+
            'width: 24px; height: 24px; cursor: pointer; }'+
            '.btnDelete.AR { width: 90px !important; margin-right: -30px; '+
            'background-color: #bedcf7 !important; } '+
            '</style></span>';

        let thead_closeRow=document.querySelector('.tableList thead .closeRow');
        if(thead_closeRow && !document.querySelector('.thead_AR')){
            thead_closeRow.insertAdjacentHTML('beforeend', thead_AR); }

        let SVG_user=
            '<svg viewBox="0 0 240 240">'+
            '<path d="M0 0L0 240L240 240L240 0L0 0z" style="fill:#fff;"></path>'+
            '<path d="M118 32C111 32 104 33 98 36C79 45 73 67 72 86C71 98 72 113 80 '+
            '123C92 136 114 135 129 134C138 133 149 131 156 124C165 115 166 103 166 '+
            '91C166 63 151 29 118 32M37 224L201 224C194 199 186 177 163 162C128 139 '+
            '81 148 55 180C45 193 40 208 37 224z" style="fill:#d4e7f5;"></path></svg>';


        for(let i=0; i<readers.length; i++){ // リストにデータベースの全フォロワーを追加表示
            insert(i); }

        disp_list(); // 生成したデータベースリストに属性色表示


        function insert(n){
            let table_tr=document.querySelectorAll('.tableList tbody tr');

            if(table_tr.length==0){ // リストにフォロワーが無い場合
                creat_tr3(n); }

            else{ // リストにフォロワーが1人でもある場合
                for(let k=0; k<table_tr.length; k++){
                    let name=table_tr[k].querySelector('.name a').textContent;
                    let time=table_tr[k].querySelector('.rdrCmnt span').textContent;
                    let time_d=time.replace(/[^0-9]/g, '')*1;

                    if(readers[n][1].replace(/[^0-9]/g, '')*1 > time_d){
                        creat_tr1(n, table_tr[k]); // 削除されたフォロワー
                        break; }

                    else if(readers[n][1].replace(/[^0-9]/g, '')*1 == time_d){
                        if(readers[n][0]==name){ // 登録更新が無い正常フォロワー
                            creat_tr2(n, table_tr[k]);
                            break; }}
                    // 登録日時が同じ別フォロワーがある場合は、次行でヒットするか
                    // ヒットが無い場合は 次行の上に削除されたフォロワー行が作成される

                    else if(readers[n][1].replace(/[^0-9]/g, '')*1 < time_d){
                        if(k==table_tr.length-1){ // 末尾行よりデータが旧い
                            creat_tr3(n); }}}}


            function creat_tr1(m, ta_tr){
                ta_tr.insertAdjacentHTML('beforebegin', tr_org(m)); }

            function creat_tr2(m, ta_tr){
                let c_btn='<input type="button" value="" class="color btn">';
                let btnDelete=ta_tr.querySelector('.btnDelete');
                if(btnDelete){
                    btnDelete.insertAdjacentHTML('afterend', c_btn); }}

            function creat_tr3(m){
                let tbody=document.querySelector('.tableList tbody');
                if(tbody){
                    tbody.insertAdjacentHTML('beforeend', tr_org(m)); }}


            function tr_org(index){
                let tr_text=
                    '<tr class="history">'+
                    '<td><p class="profThmb">'+
                    '<a class="thumb">'+ SVG_user +'</a></p></td>'+
                    '<td class="rdrCmnt"><p class="name">'+
                    '<a target="_blank" href="https://profile.ameba.jp/ameba/'+
                    readers[index][0] +'">'+ readers[index][0] +'</a></p>'+
                    '<a class="blogLink"></a><span>'+ readers[index][1] +'</span></td>'+
                    '<td class="openRow"></td>'+
                    '<td class="closeRow">'+
                    '<input type="button" value="履歴削除" class="btnDelete AR">'+
                    '<input type="button" value="" class="color btn">'+
                    '</td></tr>';

                return tr_text; }
        } // insert(n)
    } // disp_datalist()



    function database_close(){
        let thead_AR=document.querySelector('.thead_AR');
        if(thead_AR){
            thead_AR.remove(); }

        let table_tr=document.querySelectorAll('.tableList tbody tr');
        for(let k=0; k<table_tr.length; k++){
            if(table_tr[k].classList.contains('history')){
                table_tr[k].remove(); }
            else{
                let c_button=table_tr[k].querySelector('.color.btn');
                if(c_button){
                    c_button.remove(); }}}
    } // database_close()



    function set_color(flag){ // 💢💢
        if(flag=='0'){
            return '#fff'; }
        if(flag=='1'){
            return '#fe0'; }
        if(flag=='3'){ // Authentic Reader Cleaner の退会者フラグ
            return '#2196f395'; }
        else{
            return '#d6fed8' }}



    function change_color(){
        let table_tr=document.querySelectorAll('.tableList tbody tr');
        for(let k=0; k<table_tr.length; k++){
            let name=table_tr[k].querySelector('.name a').textContent;
            let c_button=table_tr[k].querySelector('.color.btn');

            if(c_button){
                c_button.onclick=function(){
                    tr_color(name);
                    disp_list(); }}}

        function tr_color(name_){
            for(let i=0; i<readers.length; i++){
                if(name_==readers[i][0]){
                    if(readers[i][2]!='3'){ // 退会者の場合はカラーの変更不可
                        readers[i][2]=((readers[i][2]+1)%3).toString(); }
                    write_local(); }}}
    } // change_color()



    function remove_data(){
        let table_tr=document.querySelectorAll('.tableList tbody tr');
        for(let k=0; k<table_tr.length; k++){
            let name=table_tr[k].querySelector('.name a').textContent;
            let d_button=table_tr[k].querySelector('.btnDelete.AR');

            if(d_button){
                d_button.onclick=function(){
                    off_history(name, k); }}}

        function off_history(name_, k){
            for(let i=0; i<readers.length; i++){
                if(name_==readers[i][0]){
                    let result=window.confirm(
                        '💢　この行のユーザーは、現在はフォロワーではありません。\n'+
                        '　　 「履歴削除」を実行すると、このユーザーを追跡する\n'+
                        '　　 情報は 完全にクリアーされます。\n\n'+
                        '　　 履歴削除をする場合は「OK」をクリックしてください。');
                    if(result){
                        readers.splice(i, 1);
                        write_local();

                        table_tr[k].remove();
                        deleted_reader=deleted_reader-1;
                        let data_disp=document.querySelector('#inner_AR2 .data_disp');
                        if(data_disp){
                            data_disp.textContent='hidden: '+ deleted_reader; }}

                }}}
    } // remove_data()



    function AR_backup(){
        let exp=document.querySelector('#inner_AR2 .export');
        let imp=document.querySelector('#inner_AR2 .import');
        let file_input=document.querySelector('#inner_AR2 .file_input');

        if(exp){
            exp.onclick=function(){
                let write_json=JSON.stringify(readers); //「フォロワー履歴」を書出す
                let blob=new Blob([write_json], {type: 'application/json'});

                let a_elem=document.createElement('a');
                a_elem.href=URL.createObjectURL(blob);
                a_elem.download='auth_reader_'+ UserID +'.json'; // 保存ファイル名
                a_elem.click();
                URL.revokeObjectURL(a_elem.href); }}



        if(imp && file_input){
            imp.onclick=function(event){
                if(!event.ctrlKey){
                    file_input.click(); }
                else{
                    let result=window.confirm(
                        '💢　=== すべての「フォロワー履歴」を削除して初期化します ===\n'+
                        '　　誤って別のUserIDのファイルを読込むと、無関係な履歴が混入します。\n'+
                        '　　無関係なリスト行は「履歴削除」で削除できますが、削除するリスト行\n'+
                        '　　が多い場合は手間がかかります。\n'+
                        '　　「フォロワー履歴」の初期化をすると有効な履歴も失われますが、履歴\n'+
                        '　　が混入した時の最短の修復方法です。 また、最近の「フォロワー履歴」\n'+
                        '　　のファイルがあれば、初期化後に読込むことで履歴を復元できます。\n\n'+
                        '　　「フォロワー履歴」を初期化する場合は「OK」をクリックしてください。');
                    if(result){
                        localStorage.removeItem('AR_'+UserID); // ローカルストレージ key名を削除
                        window.location.reload(true); // 再起動でストレージを初期化
                    }}}


            file_input.addEventListener('change' , function(){
                if(!(file_input.value)) return; // ファイルが選択されない場合
                let file_list=file_input.files;
                if(!file_list) return; // ファイルリストが選択されない場合
                let file=file_list[0];
                if(!file) return; // ファイルが無い場合

                if(file.name.startsWith('auth_reader_'+ UserID)){ // ファイル名の確認
                    let file_reader=new FileReader();
                    file_reader.readAsText(file);
                    file_reader.onload=function(){
                        let data_in=JSON.parse(file_reader.result);
                        add_readers(data_in);//「フォロワー履歴」の統合
                        write_local(); // ローカルストレージに保存
                        database_close();
                        setTimeout(()=>{
                            alert(
                                "✅　フォロワー履歴データを読込みました\n"+
                                "　　 読込んだファイル名:　" + file.name);
                            window.location.reload(true);
                        }, 200); }}
                else{
                    alert(
                        "❌　Authentic Reader の Exportファイルではありません\n"+
                        "　　 Importファイルは「auth_reader ... 」の名前です"); }
            }); }


        function add_readers(data){
            for(let d=0; d<data.length; d++){
                compare(data[d]); }

            function compare(data_){
                let count=0;
                for(let i=0; i<readers.length; i++){
                    if(data_[0]==readers[i][0]){
                        count+=1;

                        // data_の日付が 現在のreadersの日付と一致
                        if(data_[1].replace(/[^0-9]/g, '')*1==readers[i][1].replace(/[^0-9]/g, '')*1){
                            if(data_[3] && readers[i][3]){
                                if(data_[3].replace(/[^0-9]/g, '')*1>readers[i][3].replace(/[^0-9]/g, '')*1){
                                    if(readers[i][2]!='2'){
                                        if(data_[2]=='2'){
                                            readers[i][2]='2'; }
                                        else{
                                            readers[i][2]='1'; }}
                                    readers[i][3]=data_[3]; }}
                            else if(data_[3] && !readers[i][3]){
                                if(readers[i][2]!='2'){
                                    if(data_[2]=='2'){
                                        readers[i][2]='2'; }
                                    else{
                                        readers[i][2]='1'; }}
                                readers[i][3]=data_[3]; }}

                        // data_の日付が 現在のreadersの日付より旧い
                        else if(data_[1].replace(/[^0-9]/g, '')*1<readers[i][1].replace(/[^0-9]/g, '')*1){
                            if(!readers[i][3]){
                                if(readers[i][2]!='2'){
                                    if(data_[2]=='2'){
                                        readers[i][2]='2'; }
                                    else{
                                        readers[i][2]='1'; }}
                                readers[i][3]=data_[1]; }
                            else{
                                if(data_[1].replace(/[^0-9]/g, '')*1>readers[i][3].replace(/[^0-9]/g, '')*1){
                                    if(readers[i][2]!='2'){
                                        if(data_[2]=='2'){
                                            readers[i][2]='2'; }
                                        else{
                                            readers[i][2]='1'; }}
                                    readers[i][3]=data_[1]; }}}

                        if(data_[2]=='3'){ // Authentic Reader Cleaner の退会者フラグ
                            readers[i][2]='3' };
                    }}

                if(count==0){
                    readers.push(data_); }

            } // compare()
        } // add_readers()

    } // AR_backup()

} // main()
