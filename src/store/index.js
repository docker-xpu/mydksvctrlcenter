import Vue from 'vue';
import Vuex from 'vuex';

import {
  listLicence,
  listHost,
  deleteLicence,
  newLicence,
} from '../api/host';
import {
  listImages,
} from '../api/images';
import {
  listFiles,
  removeFile,
} from '../api/utils';

import {Message} from 'view-design';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: [],

    licences: [], // 主机凭据
    hosts: [], // 主机列表
    images: [],  // 镜像列表

    files: [],  // 文件列表
  },
  mutations: {},
  actions: {
    // 获取全部主机凭据
    getAllLicence(context) {
      listLicence().then(res => {
        context.state.licences = res.data;
      });
    },
    // 获取主机列表
    getAllHost(context) {
      listHost().then(res => {
        context.state.hosts = res.data;
        for (let i = 0; i < context.state.hosts.length; ++i) {
          let d = context.state.hosts[i];
          d['log'] = {
            cpu: [],
            disk: [],
            mem: [],
            package_recv: [],
            package_sent: [],
            timestamp: []
          }
        }
      });
    },
    // 删除凭据
    deleteLicence(context, license) {
      deleteLicence({
        "licenseId": license.licenseId
      }).then(res => {
        if (res.code === 0) {
          context.dispatch('getAllLicence');
        } else {
          Message.error(res.msg)
        }
      });
    },
    // 新增主机凭据
    newLicence(context, license) {
      newLicence({
        licenseName: license.name,
        password: license.pwd
      }).then(res => {
        if (res.code === 0) {
          context.dispatch('getAllLicence');
        } else {
          Message.error(res.msg)
        }
      });
    },
    // 获取全部镜像数据
    getAllImages(context) {
      listImages().then(res => {
        context.state.images = res.data;
      });
    },

    // 获取文件服务器的文件列表
    getAllFiles(context) {
      listFiles().then(res => {
        if (res.code === 0) {
          context.state.files = res.data;
        }
      });
    },
    // 删除一个文件服务器上的文件
    removeFile(context, query) {
      removeFile(query).then(res => {
        if (res.code === 0) {
          context.dispatch('getAllFiles');
          Message.success(res.msg);
        }
      })
    },
  },
  modules: {}
})
