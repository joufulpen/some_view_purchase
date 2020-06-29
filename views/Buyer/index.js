var resourceName = 'Buyer' //资源名称 模板生成
var apiName = JSON.parse(window.coolLocals['index.json'])['apiName']
window.formatterMethods = {
  showIsPurchaseInsurance: function(arg) {
    if (arg.isPurchaseInsurance == true) {
      return arg.isPurchaseInsurance.value = '是'
    }
    if (arg.isPurchaseInsurance == false) {
      return arg.isPurchaseInsurance.value = '否'
    }
  }
}
window.vm = new Vue({
  el: '#root',
  data: {
    // uniqueDeployKeyURL为前端已定义的变量 面的EmployeeInfo为后端模板生成的文件变量名 后面的为固定格式 需模板生成
    uniqueDeployKey: {
      api: apiDict[apiName] + resourceName
    },
    // axiosSetting 固定格式 需模板生成生成
    axiosSetting: {
      baseURL: apiDict[apiName],
    },
    // cool-single-dialog组件的json文件名以及它的api名称 uniqueKeyURL为前端已定义的变量 后面的EmployeeInfo为后端模板生成的文件变量名
    isMethods: {
      isGetCondition: false,
      isTableSelectionChange: false,
    },
    showModeList: true,

    // 弹出框 固定格式 里面的值可按以下定义 需模板生成
    dialogs: [{
      top: '5vh',
      name: 'dialog',
      visible: false,
      collapse: false,
      width: '90%',
      title: '',
      src: '',
    }],

    //cool-single-dialog
    uniqueKey: apiDict[apiName] + resourceName,
    currentSelected: [],
    // 业务员选择弹窗相关参数
    chooseTableData: [],
    chooseTableColumns: [],
    chooseTableCurrent: 1,
    chooseTableOffset: 10,
    chooseTableTotal: 0,
    chooseDialogTitle: '选择采购员',
    chooseDialogVisible: false,
    chooseDialogWidth: '1000px',
    showSaveButton: true,
    chooseDialogDataSelection: [],
    chooseDialogSaveDisabled: true,
    wholeData: [],

    // 数据编辑弹窗相关参数
    editDialogTitle: '',
    editDialogVisible: false,
    editDialogWidth: '1000px',
    formItems: {},
    dataTemplate: {},
    fuzzyQueryId: '',
    fuzzyQueryName: '',
  },
  computed: {
    // filteredChooseTableData() {
      // if (this.fuzzyQueryText.trim().length !== 0) {
      //   return this.chooseTableData.filter(p => p.id.includes(this.fuzzyQueryText.trim()) || p.name.includes(this.fuzzyQueryText.trim())).slice((this.chooseTableCurrent - 1) * this.chooseTableOffset, this.chooseTableCurrent * this.chooseTableOffset)
      // } else return
    //    this.chooseTableData.slice((this.chooseTableCurrent - 1) * this.chooseTableOffset, this.chooseTableCurrent * this.chooseTableOffset)
    // }
  },
  watch: {
    chooseDialogDataSelection(val) {
      this.chooseDialogSaveDisabled = val.length == 0
    }
  },
  created() {
    for (let i in window.coolLocals) {
      for (let p in JSON.parse(window.coolLocals[i])) {
        this[p] = JSON.parse(window.coolLocals[i])[p]
      }
    }
    this.getNewItem()
  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    this.$refs.singleView.query()
    // 筛选可添加项
    this.chooseTableColumns.find(p => p.type == 'selection').selectable = (row, index) => {
      if (this.chooseTableData.length !== 0) {
        let ids = this.wholeData.map(p => p.id)
        return !ids.includes(row.id)
      }
    }
  },
  methods: {
    getNewItem() {
      axiosDict[apiName].get(`Buyer/newItem`)
        .then(res => {
          console.log('获取格式模板', res);
          delete res.guid
          this.dataTemplate = res
        })
    },
    // 采购员选择弹窗相关
    // () {
    //   axiosDict['basic'].get(`Employee/GetList?condition=[]`)
    //     .then(res => {
    //       console.log('查询获取全部员工数据', res);
    //       let data = res.map(p => {
    //         return {
    //           id: p.id,
    //           name: p.name,
    //           sex: p.sex,
    //           departmentID: p.departmentID,
    //           departmentName: p.departmentName,
    //           nation: p.nation,
    //           position: p.position,
    //           phone: p.phone,
    //           email: p.email,
    //           description: p.description
    //         }
    //       }).map(p => (p = Object.assign(JSON.parse(JSON.stringify(this.dataTemplate)), p)))
    //       this.chooseTableData = data
    //       this.chooseTableTotal = data.length
    //       // this.chooseDialogVisible = true
    //     })
    //     .then(() => {
    //       axiosDict[apiName].get(`Buyer/GetList?condition=[]`)
    //         .then(resp => {
    //           this.wholeData = resp
    //           this.chooseDialogVisible = true
    //         })
    //     })
    // },
    getEmployeeData() {
      axiosDict['basic'].get(`Employee/GetPageList?condition=[{"FieldName":"Name","TableName":"[Employee]","Value":[{"value":${JSON.stringify(this.fuzzyQueryName.trim())}}],"TableRelationMode":"AND","Mode":"相似","DataType":"string"},{"FieldName":"ID","TableName":"[Employee]","Value":[{"value":${JSON.stringify(this.fuzzyQueryId.trim())}}],"TableRelationMode":"AND","Mode":"相似","DataType":"string"}]&page=${this.chooseTableCurrent}&size=${this.chooseTableOffset}`)
        .then(res => {
          console.log('查询获取全部员工数据', res);
          let data = res.rows.map(p => {
            return {
              id: p.id,
              name: p.name,
              sex: p.sex,
              departmentID: p.departmentID,
              departmentName: p.departmentName,
              nation: p.nation,
              position: p.position,
              phone: p.phone,
              email: p.email,
              description: p.description
            }
          }).map(p => (p = Object.assign(JSON.parse(JSON.stringify(this.dataTemplate)), p)))
          this.chooseTableData = data
          this.chooseTableTotal = res.total
        })
        .then(() => {
          axiosDict[apiName].get(`Buyer/GetList?condition=[]`)
            .then(resp => {
              this.wholeData = resp
              this.chooseDialogVisible = true
            })
        })
    },
    chooseDialogSelection(arg) {
      console.log('chooseDialogSelection', arg);
      this.chooseDialogDataSelection = arg
    },
    handleChooseTableSizeChange(arg) {
      console.log('handleChooseTableSizeChange', arg);
      this.chooseTableCurrent = 1
      this.chooseTableOffset = arg
      this.getEmployeeData()
    },
    handleChooseTablePageChange(arg) {
      console.log('handleChooseTablePageChange', arg);
      this.chooseTableCurrent = arg
      this.getEmployeeData()
    },
    chooseDialogSaveEvent() {
      axiosDict[apiName].post(`Buyer/BuyerInsertList`, this.chooseDialogDataSelection)
        .then(res => {
          console.log('新增业务员完成', res);
          this.chooseDialogVisible = false
          this.$refs.singleView.query()
        })
    },
    chooseDialogBackEvent() {
      this.chooseDialogVisible = false
    },
    // 编辑弹窗相关
    editBtn() {
      this.formItems.form.forEach(p => {
        p.value = this.currentSelected[0][p.name]
      })
      this.editDialogVisible = true
    },
    updateForm(arg) {

    },
    editDialogSaveEvent() {
      axiosDict[apiName].put(`Buyer`, this.currentSelected[0])
        .then(res => {
          console.log('编辑完成', res);
          let replaceData = this.$refs.singleView.singleTableData.data.find(p => p.guid == res.guid)
          replaceData = Object.assign(replaceData, res)
          this.editDialogVisible = false
          // this.$refs.singleView.query()
        })
    },
    editDialogBackEvent() {
      this.$refs.formItems.resetForm()
      this.editDialogVisible = false
    },
    // 单表
    tableSelectionChange(arg) {
      this.currentSelected = arg
    },
    tableRowClick(arg) {
      this.$refs.singleView.$refs.table.$refs.table.$refs.table.toggleRowSelection(arg)
    },
    tableRowDblclick(arg) {

    },
    paginationSizeChange(arg) {

    },
    paginationCurrentChange(arg) {

    },
    getCondition(arg) {

    },
    rowClassName({row,rowIndex}) {
      if(this.wholeData.map(p => p.id).includes(row.id)) return 'disabled-row'
      else return ''
    },
  }
})
