<template>
  <div class="nodeInfo-detail-container">
    
     <div v-if="nodeDetail != null" class="nodeInfo-main-container">
       <DescriptionList v-if="nodeDetail != null" title="节点信息" col="12" :content="nodeDetail">
        <Description term="节点名称">{{ nodeDetail.nodeInfo.machineGroup }} / {{ nodeDetail.nodeInfo.machineName }}</Description>
        <Description term="节点编号">{{ nodeDetail.nodeInfo.localSerialNumber }}</Description>
        <Description term="钱包地址">{{ nodeDetail.nodeInfo.address }}</Description>
        <Description term="BEE版本">{{ nodeDetail.nodeInfo.beeVersion }}</Description>
        <Description term="连接状态">{{ nodeDetail.nodeInfo.status | statusFilter }}</Description>
        <Description term="健康检查">{{ nodeDetail.storeValue.healthStatus.value ? nodeDetail.storeValue.healthStatus.value.status : '' }}</Description>
      </DescriptionList>
    </div>
    <el-tabs v-loading="loading" v-if="nodeDetail != null" v-model="activeTab" style="margin-top:15px;margin-left:15px;" type="border-card">
        <el-tab-pane v-for="item in nodeInfoTabs" :key="item.key" :label="item.label" :name="item.key">
          <keep-alive>
            
            <node-cheque-list 
              v-if="item.key == 'cheque' && nodeDetail != null"
              :storeValue="nodeDetail.storeValue" :nodeInfo="nodeDetail.nodeInfo" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import { getNodePage, getNodeDetail } from '@/api/node'
import NodeChequeList from './node_cheque_list'
import DescriptionList from '@/views/node/description_list'
export default {
  components: {NodeChequeList,DescriptionList},
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
      nodeInfoTabs: [
        {label: '支票', key: 'cheque'},
      ],
      activeTab: 'cheque',
      nodeDetail: null,
      loading: false,
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      const id = this.$route.params && this.$route.params.id
      getNodeDetail(id).then(res => {
        this.nodeDetail = res.result
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.nodeInfo-detail-container {
  position: relative;

  .nodeInfo-main-container {
    padding: 15px 40px 0px 40px;
  }
}
</style>