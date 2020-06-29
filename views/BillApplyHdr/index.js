
function passSelection({ to, data }) {
    console.log(1,'passSelection')
    document.getElementById(to).contentWindow.postMessage({ method: 'alertData', args: data }, '*')
    console.log(to,data)
    if(vm.dialogs[0].title == '选择关联订单'){
      if(data.data.length == 1){
      if(data.hasOwnProperty('closeDialog') && to == 'dialog'){
          vm.applyFormItems.form.find(p=>p.name=='formno').value = data.data[0].formno
          vm.hasChooseOrderCode = data.data[0].formno
          vm.orderData = data.data[0]
          vm.dialogs[0].visible = !vm.dialogs[0].visible
      }
      }else{
        vm.$message('抱歉 只能选一条数据')
      }
    }
    else {
      if(data.hasOwnProperty('closeDialog') && to == 'dialog'){     
       // let filterData = data.data.filter(a => !vm.inTableData.map(b => b.guid).includes(a.guid)).map(a => { return a })        
        // if(vm.dialogs[0].title == '选择基础物料')vm.columns.find(p=>p.label == '数量').prop = 'qty'
       data.data.map(item=>{
        // axios.get(vm.uniqueKey + '/NewDtl').then(res=>{
          console.log(vm.dtlNewItem)
          // if(res){
            delete item.guid
            delete item.ts
            let copyData = JSON.parse(JSON.stringify(vm.dtlNewItem))
            console.log(copyData)
            let newData = Object.assign(copyData,item)   
            if(vm.dialogs[0].title == '选择部件'){
              newData.qty = newData.quantity
              newData.pigment = newData.colorNumber
              newData.source = "定制部件"
              newData.specifications = `${newData.length}*${newData.width}*${newData.height}`
            }
            if(vm.dialogs[0].title == '选择定制物料'){
              newData.qty = newData.quantity
              newData.source = "定制物料"
              newData.specifications = `${newData.width}*${newData.height}`
            }
            if(vm.dialogs[0].title =='选择基础物料')newData.source = "基础物料"
            if(vm.dialogs[0].title =='选择配件物料')newData.source = "配件物料"
            vm.inTableData.push(newData)
            console.log(newData)
          // }          
        // })    
        })
       setTimeout(()=>{ vm.dialogs[0].visible = !vm.dialogs[0].visible },500)                       
      }
    }     
    }
   function getSelection({ from, to }) {
    console.log(2,'getSelection')
    document.getElementById(from).contentWindow.postMessage({ method: 'postSelection', args: { to } }, '*')
    }

window.formatterMethods = {
    
 }
var resourceName = 'BillApply'//资源名称 模板生成
var apiName = JSON.parse(window.coolLocals['index.json'])['apiName']
window.vm = new Vue({
  el: '#root',
  data: {
    // uniqueDeployKeyURL为前端已定义的变量 面的EmployeeInfo为后端模板生成的文件变量名 后面的为固定格式 需模板生成
     uniqueDeployKey:{
      api: apiDict[apiName] + resourceName
     },
     // axiosSetting 固定格式 需模板生成生成
     axiosSetting:{
        baseURL:apiDict[apiName],
      },
      // cool-single-dialog组件的json文件名以及它的api名称 uniqueKeyURL为前端已定义的变量 后面的EmployeeInfo为后端模板生成的文件变量名
     isMethods:{
      isGetCondition:false,
      isTableSelectionChange:false,
     },
     showModeList:true,
     quickDialogVisible:false,
    dialogWidth:'400px',
    labelWidth:'100px',
    currentEditData:{},
    quickCoolFormItems:{
        form:[{
          "type": "input",
          "value": "",
          "label": "物料编号",
          "disabled":true,
          "readonly":true,
          "name": "id",
          "style": {
            "width": "100%"
          }
        },{
          "type": "input",
          "value": "",
          "label": "物料名称",
          "disabled":true,
          "readonly":true,
          "name": "name",
          "style": {
            "width": "100%"
          }
        },{
          "type": "input",
          "value": "",
          "label": "物料规格",
          "disabled":true,
          "readonly":true,
          "name": "specifications",
          "style": {
            "width": "100%"
          }
        },{
          "type": "inputNumber",
          "value": "",
          "label": "数量",
          "inputStyle":{"width":"193px"},
          "min":0,
          "disabled":false,
          "name": "qty",
          "style": {
            "width": "100%"
          }
        },{
          "type": "date",
          "inputStyle":{"width":"193px"},
          "value": "",
          "label": "预计到货时间",
          "disabled":false,
          "name": "arrivalDate",
          "style": {
            "width": "100%"
          }
        },{
          "type": "input",
          "value": "",
          "label": "备注",
          "disabled":false,
          "name": "description",
          "style": {
            "width": "100%"
          }
        }      
        ]
      },
      // 弹出框 固定格式 里面的值可按以下定义 需模板生成
     dialogs: [
        {
          top: '5vh',
          name: 'dialog',
          visible: false,
          collapse: false,
          width: '90%',
          title: '',
          src: '',
          saveBtnText:"确 认",
          showSaveButton:true
        }
      ],
      theRestParams:{
      query:{
        condition:[
        {"FieldName":"Tag","TableName":"[Dtl]","Value":[{"value":false}],"TableRelationMode":"AND","Mode":"为空","DataType":"boolean"}
        ],
        additional:{

        }
      }
     },
     //cool-single-dialog 
     uniqueKey: apiDict[apiName] + resourceName,
     // 是否显示cool-single-dialog组件 默认值固定为false 需模板生成
     dialogVisible:false,
     isDialogMethods:{
      isUpdateForm:false,
      isSaveEvent:false,
     },
     inTableData:[],
     orderFormItems:null,
     editDialogTitle:'采购申请单管理',
     labelWidth:'115px',
     showButton:true,
     applyFormItems:{
      form:[{
        "type": "select",
        "options":[],
        "value": "",
        "label": "采购原因",
        "name": "purchaseReason",
        "readonly":false,
        "disabled":false,
        "style": {
          "width": "50%"
        },
          "rules": {
            "required": true,
            "message": "采购原因不能为空",
            "trigger": "change"
          }
      }, {
        "type": "mixInput",
        "options":[],
        "value": "",
        "label": "关联订单",
        "name": "formno",
        "readonly":true,
        "disabled":false,
        "buttonDisabled":false,
        "inputStyle":{
          "width":"193px"
        },
        "style": {
          "width": "50%"
        }
      },{
        "type": "select",
        "options":[{
         "value":"物料",
          "label":"物料" 
        }],
        "value": "",
        "label": "类型",
        "name": "type",
        "readonly":true,
        "disabled":false,
        "style": {
          "width": "50%"
        },
          "rules": {
            "required": true,
            "message": "类型不能为空",
            "trigger": "change"
          }
      }, {
        "type": "input",
        "value": "",
        "label": "备注",
        "name": "description",
        "readonly":false,
        "disabled":false,
        "inputStyle":{
          "width":"193px"
        },
        "style": {
          "width": "50%"
        }
      }]
     },
        columns:[
        {
          "type": "selection",
          "width": '55px'
        },
        {
          "type": "index",
          "label":"序号",
          "width":"50px"
        },
        {
          "prop": "id",
          "label": "物料编号"
        }
        ,
        {
          "prop": "name",
          "label": "物料名称"
        }
        ,
        {
          "prop": "byname",
          "label": "物料别名"
        }
        ,
        {
          "prop": "version",
          "label": "品牌型号"
        }
        ,
         {
          "prop":"specifications",
          "label":"物料规格"
        },
        {
          "prop": "pigment",
          "label": "物料颜色"
        },
        {
          "prop": "unit",
          "label": "采购单位"
        },
        {
          "prop": "qty",
          "label": "数量"
        },
        {
          "prop": "arrivalDate",
          "label": "预计到货时间",
          "formatter":function(arg){
            if(arg.arrivalDate){
              return dayjs(arg.arrivalDate).format("YYYY-MM-DD")
            }
          }
        },
        {
          "prop": "description",
          "label": "备注(采购申请单明细备注)"
        }
        ],
        buttons:[{
        text: "选择定制部件",
        size: "mini",
        icon: "#iconxuanze",
        disabled: true,
        type:"primary"
      },{
        text: "选择定制物料",
        size: "mini",
        icon: "#iconxuanze",
        disabled: true,
        type:"success"
      },{
        text: "选择基础物料",
        size: "mini",
        icon: "#iconxuanze",
        disabled: true,
        type:"warning"
      },{
        text: "选择配件物料",
        size: "mini",
        icon: "#iconxuanze",
        disabled: true,
        type:"info"
      },{
        text: "移除",
        size: "mini",
        icon: "#iconERP_shanchu",
        disabled: true,
        type:"danger"
      },{
        text: "编辑",
        size: "mini",
        icon: "#iconERP_bianji",
        disabled: true,
        type:"info"
      }
      ],
      coolLabelWidth:'80px',
      hasChooseOrderCode:null,
      tableHeight:'300px',
      dialogTitle:'编辑物料',
      materialData:[],
      allData:[],
      alreadyDelData:[],
      selectData:[],
      stripe:false,
      rowClickData:null,
      rowDblclickData:null,
      selectionData:null,
      coolFormData:{},
      hdrNewItem:{},
      dtlNewItem:{},
      dialogUpdateFormData:null,
      editDialogTitleVisible:false,
      isCheck:false,
      isChoose:null,
      orderData:null,
  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    for (let i in window.coolLocals) {
      if(i == 'dialogForm.json'){
        for (let p in JSON.parse(window.coolLocals[i])) {
        this[p] = JSON.parse(window.coolLocals[i])[p]
      }
      }     
    }
    // 采购原因数据
    axiosDict['basic'].get('BaseProperty/GetList?condition=[%7B%22FieldName%22:%22Type%22,%22TableName%22:%22[BaseProperty]%22,%22Value%22:[%7B%22value%22:%22%E9%87%87%E8%B4%AD%E5%8E%9F%E5%9B%A0%22%7D],%22TableRelationMode%22:%22AND%22,%22Mode%22:%22%E7%AD%89%E4%BA%8E%22,%22DataType%22:%22string%22%7D]').then(res=>{
      console.log(res)
      if(res)this.applyFormItems.form.find(item=>item.label == '采购原因').options = res.map(p=>{ return {label:p.name,value:p.name}})
    })
    // 获取newItem
     axiosDict[apiName].get(this.uniqueKey +'/NewDtl').then(res=>{
          console.log(res)
          if(res){
            this.dtlNewItem = res
            delete this.dtlNewItem.guid
          }
      })
    // 页面进入自动查询
    this.$refs.masterView.query()
  },
  watch:{
    isCheck(arg){
      this.applyFormItems.form.map(item=>item.disabled = arg)
      this.coolFormItems.form.map(item=>item.disabled = arg)
      this.buttons.find(p=>p.text == '选择基础物料').disabled = arg
    },
    rowDblclickData(arg){
      this.coolFormItems.additionButtons.buttons[0].disabled = arg == null
    },
    
    isDisabled(arg){
      // if(!this.isEdit){
        console.log(arg)
      this.buttons.find(p=>p.text == '选择定制部件').disabled = arg[0] == '' ? true : arg[0] == '零部件' ? false : true
      this.buttons.find(p=>p.text == '选择定制物料').disabled = arg[0] == '' ? true : arg[0] == '零部件' ? true : this.hasChooseOrderCode == null ? true : false
      this.buttons.find(p=>p.text == '选择基础物料').disabled = arg[0] == '' ? true : arg[0] == '零部件' ? true : false
      this.buttons.find(p=>p.text == '选择配件物料').disabled = arg[0] == '' ? true : arg[0] == '零部件' ? true : this.hasChooseOrderCode == null ? true : false
      // } 
    },
    hasChooseOrderCode(arg){
      // if(!this.isEdit){
        console.log(arg)
      this.buttons.find(p=>p.text == '选择定制物料').disabled = this.isDisabled == '' ? true : this.isDisabled == '零部件' ? true : arg == null ? true : false
      this.buttons.find(p=>p.text == '选择配件物料').disabled = this.isDisabled == '' ? true : this.isDisabled == '零部件' ? true : arg == null ? true : false
      // }   
    },
    inTableData(arg){
      console.log(arg)
      if(arg){
       this.applyFormItems.form.find(p=>p.name == 'formno').disabled = arg.some(item=>{return item.parentID !== null})
       this.applyFormItems.form.find(p=>p.name == 'formno').buttonDisabled = arg.some(item=>{return item.parentID !== null})
       this.applyFormItems.form.find(p=>p.name == 'type').disabled = arg.some(item=>{return item.parentID !== null})
       this.buttons.find(p=>p.text == '选择定制物料').disabled = !arg.some(item=>{return item.source == "定制物料"})
       this.buttons.find(p=>p.text == '选择基础物料').disabled = !arg.some(item=>{return item.source == "基础物料"})
       this.buttons.find(p=>p.text == '选择定制部件').disabled = !arg.some(item=>{return item.source == "定制部件"})
       this.buttons.find(p=>p.text == '选择配件物料').disabled = !arg.some(item=>{return item.source == "配件物料"})
      }
    },
    isShowText(arg){
      if(!arg[0]){
        this.applyFormItems.form.find(p=>p.name == 'type').options = [{"value":"零部件","label":"零部件"},{"value":"物料","label":"物料"}]
      }else this.applyFormItems.form.find(p=>p.name == 'type').options = [{"value":"物料","label":"物料"}]    
    }
  },
  computed:{
    isDisabled:function(){
        return this.applyFormItems.form.map(p=>{
          if(p.name == 'type') return p.value 
        }).filter(p=>p != undefined)
    },
    isShowText:function(){
      return this.applyFormItems.form.map(p=>{
        if(p.name =='formno') return p.value == '' || p.value == null
      }).filter(p=>p != undefined)
    },
    tableData:function(){
        return this.inTableData
    }
  },
  methods: {
    inputButtonEvent(){
      this.dialogs[0].title = '选择关联订单'                         
      this.dialogs[0].src = `../BillApply_chooseMaterial/index.html#${token}#id#${this.dialogs[0].name}#chooseOrder`
        setTimeout(() => {
          getDialog(this.dialogs,'dialog').visible = true
        }, 100)
    },
    check(){
      this.customEdit()
      this.isCheck = true  
    },
    rowDblclick(arg){
        console.log(arg)
        this.quickEditEvent(arg)
    },
    quickEditEvent(arg){
      this.currentEditData = arg
        this.quickDialogVisible = true
        this.quickCoolFormItems.form.forEach(item=>{
          for(let i in arg){
            if(i == item.name)item.value = arg[i]
          }
        })
        this.$refs.tableView.clearCurrentRow()
    },
      tableBackEvent(){
        this.editDialogTitleVisible = false
      },
      tableSaveEvent(){
         this.rowClickData = Object.assign(this.rowClickData,this.dialogUpdateFormData)
         this.tableBackEvent()
      },
      outSelection(arg){
        this.buttons.find(p=>p.text == '移除').disabled = arg.length === 0
        this.buttons.find(p=>p.text == '编辑').disabled = arg.length !== 1
        if(arg.length != 0){
          this.selectionData = []
          arg.map(item=>{
            this.selectionData.push(item)
          })
        }        
      },
      outRowClick(arg){
      
      },   
      dialogSaveEvent(){
        var to = 'dialog'
        let secondDialog = document.getElementById('dialog')
        console.log(secondDialog)
        secondDialog.contentWindow.postMessage({ method: 'postSelection', args: { to } }, '*')
      },
      dialogBackEvent(){
         getDialog(this.dialogs,'dialog').visible = false
      },
      buttonClick(args){
          let carryCode = null
          this.isEdit ? carryCode = this.selectData[0].formno : carryCode = this.hasChooseOrderCode
        switch (args.currentTarget.textContent.trim()) {
          case '选择定制部件':
              {
               this.dialogs[0].title = '选择部件'              
                // this.dialogs[0].src = `${serveDict['productionURL']}Part/index.html#${token}#${carryCode}#${this.dialogs[0].name}#apply#alreadyChooseData=${window.encodeURIComponent(JSON.stringify(this.inTableData))}`
               this.dialogs[0].src = `../CustomParts/index.html#${token}#${carryCode}#${this.dialogs[0].name}#apply#alreadyChooseData=${window.encodeURIComponent(JSON.stringify(this.inTableData))}`   
                  setTimeout(() => {
                    getDialog(this.dialogs,'dialog').visible = true
                  }, 100)
                break;
              }
          case '选择定制物料':
              {
               // this.$message('努力开发中 请稍等！ work hard;please hold on!! ')
               this.dialogs[0].title = '选择定制物料'
               this.dialogs[0].src = `${serveDict['productionURL']}Aluminum/index.html#${token}#${carryCode}#${this.dialogs[0].name}#apply#alreadyChooseData=${window.encodeURIComponent(JSON.stringify(this.inTableData))}`
                  setTimeout(() => {
                    getDialog(this.dialogs,'dialog').visible = true
                  }, 100)
                break;
              }    
          case '选择基础物料':
              {
                this.dialogs[0].title = '选择基础物料'              
                this.dialogs[0].src = `../BillApply_chooseMaterial/index.html#${token}#id#${this.dialogs[0].name}#apply#alreadyChooseData=${window.encodeURIComponent(JSON.stringify(this.inTableData))}`
                  setTimeout(() => {
                    getDialog(this.dialogs,'dialog').visible = true
                  }, 100)
                break
              }
          case '选择配件物料':
              {
                // this.$message('=.= 稍等片刻 我去买个橘子 ·····')
                this.dialogs[0].title = '选择配件物料'              
                this.dialogs[0].src = `${serveDict['productionURL']}Accessory/index.html#${token}#${carryCode}#${this.dialogs[0].name}#apply#alreadyChooseData=${window.encodeURIComponent(JSON.stringify(this.inTableData))}`
                  setTimeout(() => {
                    getDialog(this.dialogs,'dialog').visible = true
                  }, 100)
                break
              }    
          case '移除':
              {
                  this.selectionData.forEach(p => {
                    if(p.ts !== null){
                      p.recStatus = 2
                      p.deleted = true
                      this.alreadyDelData.push(p)
                    }   
                    this.inTableData.splice(this.inTableData.indexOf(p), 1)
                  })
                 console.log(this.alreadyDelData)
                break;
              }
           case '编辑':{
            this.quickEditEvent(this.selectionData[0])
           }            
          default:
            break;
        }
      },
      audit(){
      // this.$message('开发中 别急')
      axiosDict[apiName].post(this.uniqueKey +'/Agree',{formno:this.selectData[0].formno}).then(res=>{
          console.log(res)
          if(res){
            Vue.prototype.$notify.success({
                                title: '审核成功',
                                message: '审核成功',
                                duration: 2000,
                              }) 
                let currentDataIndex =  this.$refs.masterView.hdrTableData.data.findIndex(item=>{
                  return  item.guid == res.guid
                })
                console.log(currentDataIndex)
                this.selectData[0] = Object.assign( this.selectData[0],res)
                this.$refs.masterView.clearSelectionOuter()
          }
      })
    },
      customNew(){ 
        this.dialogVisible = true
        this.isEdit = false
         // get newItem
        axiosDict[apiName].get(this.uniqueKey +'/NewHdr').then(res=>{
          console.log(res)
          if(res)this.hdrNewItem = res
        })
      },
      customEdit(){
          this.dialogVisible = true
           let param = { 
              formno:this.selectData[0].formno,condition:JSON.stringify([])
            }
            axiosDict[apiName].get(this.uniqueDeployKey.api + '/GetDtlList',{
            params:param
            }).then(res => {
                console.log(res) 
                if(res){
                  this.inTableData = []
                  res.forEach( item=> {
                    this.inTableData.push(item)
                  });
                }             
              })
         this.applyFormItems.form.map(p=>{
          for(let i in this.selectData[0]){
              if(i == p.name)p.value = this.selectData[0][i]
            }
         }) 
         this.isEdit = true
      },
      backEvent(){
          this.$refs.coolForm.clearForm()
          this.$refs.coolForm.resetForm()
          this.applyFormItems.form.forEach(p=> p.value= '')   
          this.inTableData = []
          this.alreadyDelData = []
          this.rowClickData = null
          this.dialogVisible = false
          this.isCheck = false
          this.hasChooseOrderCode = null
          this.buttons.forEach(p=>p.disabled =true)
      },
      masterUpdateForm(arg,val,label){
          console.log(arg)
          this.coolFormData = arg
      },
      //cool-single-view 
      tableRowClick(arg){
        console.log(arg)
        if(arg.checkState !='已审核')this.$refs.masterView.$refs.table.$refs.table.$refs.table.$refs.table.toggleRowSelection(arg)     
      },
      tableRowDblclick(arg){
          
      },
      tableSelectionChange(arg){
          this.selectData = []
          if(arg.length != 0) arg.map(item=>{this.selectData.push(item)}) 
          console.log(arg)   
      },  
      paginationSizeChange(arg){

      },
      paginationCurrentChange(arg){

      },
      getCondition(arg){

      },
      // cool-single-dialog
      updateForm(arg){
        console.log(arg)
        this.dialogUpdateFormData = arg
      },
      saveEvent(arg){
        if(this.$refs.coolForm.validateForm()){
                if(this.inTableData.length){
                  console.log(this.inTableData.some(p=>p.qty == 0))
                if(this.inTableData.some(p=>p.qty == 0)){
                  this.$message('明细数量均不能为零')
                }else{
                   let allFormData = {}
              // 判断编辑还是新建
              this.isEdit ? allFormData = Object.assign(this.selectData[0],this.coolFormData) : allFormData = Object.assign(this.hdrNewItem,this.coolFormData)
          
              // if(this.isEdit) allFormData.RecStatus = 1  //该处仅为测试
              console.log(allFormData)
              let param
              this.allData = this.inTableData.concat(this.alreadyDelData)
              // this.inTableData.map(item=>{item.leave = item.qty})
              // this.allData.map(item=>{ item.leave = item.qty}) 
              this.isEdit ? param = { hdr:allFormData,dtls:this.allData } : param = { "hdr":allFormData,"dtls":this.inTableData}  

              console.log(param)
              if(this.isEdit){
                param.hdr.recStatus = 1   
                param.dtls.map(p=>{
                  if(p.ts !== null && p.recStatus != 2)p.recStatus = 1
                })
                axiosDict[apiName].post(this.uniqueKey + '/Save', param).then(res=>{
              console.log(res)
              if(res){
                // 编辑 根据当前数据的id 在表格数据中找到它所在的索引 然后将编辑好的数据替换
                Vue.prototype.$notify.success({
                                title: '编辑数据成功',
                                message: '编辑数据成功',
                                duration: 2000,
                              }) 
                let currentDataIndex =  this.$refs.masterView.hdrTableData.data.findIndex(item=>{
                  return  item.guid == res.guid
                })
                console.log(currentDataIndex)
                this.selectData[0] = Object.assign( this.selectData[0],res)
                allFormData = null
                this.backEvent()
              }
            })
              }else{
                // param.hdr.formno = this.orderData.formno
                if(this.orderData !== null) param.hdr.projectName = this.orderData.projectName
                axiosDict[apiName].post(this.uniqueKey + '/Save', param).then(res=>{
                console.log(res)
              if(res){
                // 新建 直接push进去表格数据中 感觉新建完的数据应该在第一条 
                Vue.prototype.$notify.success({
                                title: '新增数据成功',
                                message: '新增数据成功',
                                duration: 2000,
                              }) 
                  this.$refs.masterView.hdrTableData.data.unshift(res)
                  allFormData = null
                  this.backEvent()
             }
            })
              }
                }
             
            }else{
              this.$message({
                          type: 'warning',
                          message: '必须输入单据明细',
                          duration: 1500
                      });
            }
          }
      }
  }
})
