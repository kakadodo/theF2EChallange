$(function(){
  let API = 'https://wapi.gogoro.com/tw/api/vm/list';

  const vm = new Vue({
    el:'#app',
    data:{
      loading: true,
      listsData:[],
      pageData:[],
      pagination:[],
      currentPage:1,
      filterMode: false,
      filterData:[],
      filterInputData:{
        LocName:'',
        City:'',
        District:'',
        AvailableTime: false
      },
      filterOpen:false,
      modalLocName:'',
      googleMap:{
        map:{},
        marker:{},
        infowindow:{}
      }
    },
    computed:{
      showPages(){
        //依 currentPage 決定當前的頁數範圍
        let pageRange = {
          min: this.currentPage % 10 == 0 ? (this.currentPage - 9) : (Math.floor(this.currentPage / 10) * 10 + 1),
          max: this.currentPage % 10 == 0 ? this.currentPage : Math.ceil(this.currentPage / 10) * 10
        };
        // max 計算超過 pagination 總長度的話，max 就改為總長度
        if(pageRange.max > this.pagination.length) pageRange.max = this.pagination.length;
        return this.pagination.filter((page,i)=>{return page >= pageRange.min-1 && page <= pageRange.max-1});
      },
      getCity(){
        const citys = this.listsData.map((list,i)=> JSON.parse(list.City).List[1].Value);
        return citys.filter((city,i,arr)=> arr.indexOf(city) == i);
      },
      getDistrict(){
        const inputCity = this.filterInputData.City;
        if(inputCity==''){
          return '';
        }else{
          const district = [];
          this.listsData.forEach((list,i)=>{
            if(JSON.parse(list.City).List[1].Value == inputCity){
              district.push(JSON.parse(list.District).List[1].Value);
            }else{
              return;
            }
          });
          return district.filter((dist,i,arr)=> arr.indexOf(dist) == i);
        }
      }
    },
    methods:{
      getAPIData(){
        axios.get(API)
        .then(function (response) {
          vm.listsData = response.data.data;
          // console.log(vm.listsData);
          vm.combineDataByPages();

        })
        .catch(function (error) {
          alert('資料載入有誤，請稍後再試! error: '+ error);
        });
      },
      combineDataByPages(){
        //複製一份原始資料
        const dataCopy = JSON.parse(JSON.stringify(vm.listsData));
        //需要render的總頁數 31頁
        const pageCount = dataCopy.length%20 == 0? (dataCopy.length/20) : parseInt(dataCopy.length/20)+1;
        //重組成以頁數區分的資料，1頁20筆
        for(let i=0; i<pageCount; i++){
          this.pageData.push(dataCopy.splice(0,20));
          vm.pagination.push(i);
        }
        this.loading = false;
      },
      movePage(move){
        if(move == 'prev'){
          this.currentPage--;
        }else if(move == 'next'){
          this.currentPage++;
        }else{
          this.currentPage = parseInt(move);
        }
      },
      showMap(data){
        this.modalLocName = JSON.parse(data.LocName).List[1].Value;
        const _this = this;
        const pos = {lat: data.Latitude, lng: data.Longitude};
        const icon = 'https://raw.githubusercontent.com/kakadodo/theF2EChallange/gh-pages/img/week2/battery-icon.png';
        const address = JSON.parse(data.Address).List[1].Value.replace(/\(.+\)/g,'');
        const content = `
          <div>
            <h5>${JSON.parse(data.LocName).List[1].Value}</h5>
            <p>
              <a href='https://www.google.com/maps/place/${address}' target='_blank'>
                ${JSON.parse(data.Address).List[1].Value}
              </a>
            </p>
          </div>
        `;
        this.googleMap.map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 15
        });
        this.googleMap.marker = new google.maps.Marker({
          position: pos,
          map: _this.googleMap.map,
          icon: icon,
          animation: google.maps.Animation.DROP,
        });
        this.googleMap.infowindow = new google.maps.InfoWindow({
          content: content,
        });
        this.googleMap.infowindow.open(this.googleMap.map, this.googleMap.marker);
      },
      filterLists(){
        //判斷是否為 filter mode
        if(this.filterInputData.LocName == '' && this.filterInputData.City == '' && this.filterInputData.District == '' && this.filterInputData.AvailableTime == false){
          this.filterMode = false;
        }else{
          this.filterMode = true;
        }
        let tempData = JSON.parse(JSON.stringify(this.listsData));
        for(let key in this.filterInputData){
          //檢查 LocName、City、District
          if(this.filterInputData[key]!=='' && key !== 'AvailableTime'){
            tempData = tempData.filter((list,i)=>{
              if(key == 'LocName'){
                return (JSON.parse(list[key]).List[1].Value).toLowerCase().indexOf((this.filterInputData[key]).toLowerCase())!== -1;
              }else{
                return JSON.parse(list[key]).List[1].Value == this.filterInputData[key];
              }
            });
          }
          //檢查 AvailableTime
          if(key == 'AvailableTime' && this.filterInputData[key]){
            tempData = tempData.filter((list,i)=>{
              return list[key] == '24HR';
            });
          }
        }
        //將篩選後的結果篩回 filterData
        this.filterData = tempData.filter((list,i)=>{
          return true;
        });
      }
    },
    watch:{
      'filterInputData.LocName':function(val){
        this.debounce(val);
      },
      'filterInputData.City':function(val){
        this.filterInputData.District = '';
        vm.filterLists();
      },
      'filterInputData.AvailableTime':function(val,oldVal){
        if(val !== oldVal) vm.filterLists();
      }
    },
    created(){
      //定義 underscore debounce 讓 vue 使用
      this.debounce = _.debounce(this.filterLists,500);
    },
    mounted(){
      this.getAPIData();
    }
  });
});