<template>
  <div class="app-container">
    
<div class="filter-container">
      <el-input v-model="query.localSerialNumber" placeholder="节点编号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="query.machineGroup" placeholder="分组" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="query.machineName" placeholder="机器名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="query.beeVersion" placeholder="版本号" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      
      <el-select v-model="query.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      
    </div>
    <p>
      总节点：{{nodeStat.totalCount}}个节点，在线：{{nodeStat.onlineCount}}个节点，总支票：{{nodeStat.chequeTotalCount}}张，有效支票：{{nodeStat.chequeValidCount}}张
    </p>
    <el-table
      v-loading="listLoading"
      :data="page.records"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >

      <el-table-column label="节点编号" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.localSerialNumber }}
        </template>
      </el-table-column>
      <el-table-column label="机器名称" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.machineGroup }}
          /
          {{ scope.row.machineName }}
        </template>
      </el-table-column>
      <el-table-column label="BEE版本" align="center">
        <template slot-scope="scope">
          {{ scope.row.beeVersion }}
        </template>
      </el-table-column>

      <el-table-column label="连接数" align="center" >
        <template slot-scope="scope">
          {{ scope.row.store.peersCount }}
        </template>
      </el-table-column>

      <el-table-column label="支票" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.store.chequeCount != null">
            {{scope.row.store.chequeCount.validTotal}}
            /
            {{scope.row.store.chequeCount.total}}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
          /
          {{ scope.row.store.healthStatus ? scope.row.store.healthStatus.status : ''}}
        </template>
      </el-table-column>


      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" 
            @click="alert('敬请期待')">提现</el-button>
        </template>
      </el-table-column>
    </el-table>
<pagination v-show="page.total>0" :total="page.total" :page.sync="page.page" :limit.sync="page.size" @pagination="fetchData" />

  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" title="编辑配置项" >
      <el-form ref="editForm" :model="editForm" :rules="editFormValidate" autocomplete="on" label-width="120px">
        <el-form-item label="配置项" prop="name">
          <el-input v-model="editForm.name" disabled />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="editForm.value" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="updateConfig">提交</el-button>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getNodePage } from '@/api/node'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': '待绑定',
        '2': '在线',
        '3': '离线'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      query: {
        localSerialNumber: null,
        beeVersion: null,
        machineGroup: null,
        machineName: null,
        status: null
      },
      statusOptions: [{label: '在线', value: 2},{label: '离线', value: 3}],
      page: {
        records: null,
        current: 1,
        hitCount: false,
        maxLimit: null,
        optimizeCountSql: true,
        orders: [],
        pages: 1,
        searchCount: true,
        size: 10,
        total: 0,
      },
      nodeStat: {

      },
      editForm: {},
      editFormValidate: {
        value: [
            { required: true, message: '请输入配置值' },
          ],
      },
      listLoading: true,
      dialogVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    
    handleFilter() {
      this.page.page = 1
      this.fetchData()
    },

    fetchData() {
      this.listLoading = true
      getNodePage(this.query, this.page.page, this.page.size).then(response => {
        this.page.records = response.result.pageInfo.records
        this.page.total = response.result.pageInfo.total
        this.nodeStat = response.result.nodeStat
        this.listLoading = false
      })
    },
    editConfig(row) {
      this.editForm = {
        name: row.name,
        code: row.code,
        value: row.value
      }
      this.dialogVisible = true
    },

    updateConfig() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          updateConfig(this.editForm.code, this.editForm.value).then((res) => {
            this.$message({
              message: '处理成功',
              type: 'success'
            })
            this.fetchData()
            this.dialogVisible = false
          })
        }
      })
      
    }
  }
}
</script>
