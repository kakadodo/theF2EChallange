"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var vm = null;
var projectData = [{
  "id": 1,
  "type": "project",
  "name": "工作",
  "children": [{
    "id": 11,
    "type": "folder",
    "parentId": [1],
    "name": "老闆給的",
    "colorTag": "red",
    "isMarkBoxOpen": false,
    "children": [{
      "id": 111,
      "type": "img",
      "parentId": [11],
      "name": "螢幕截圖",
      "colorTag": "orange",
      "isMarkBoxOpen": false
    }, {
      "id": 112,
      "type": "pdf",
      "parentId": [11],
      "name": "後端 API 串接說明",
      "colorTag": "purple",
      "isMarkBoxOpen": false
    }, {
      "id": 113,
      "type": "folder",
      "parentId": [1, 11],
      "name": "巢狀資料夾",
      "colorTag": "red",
      "isMarkBoxOpen": false,
      "children": [{
        "id": 1131,
        "type": "img",
        "parentId": [113],
        "name": "另一個螢幕截圖",
        "colorTag": "orange",
        "isMarkBoxOpen": false
      }, {
        "id": 1132,
        "type": "pdf",
        "parentId": [113],
        "name": "另一個後端 API 串接說明",
        "colorTag": "purple",
        "isMarkBoxOpen": false
      }, {
        "id": 1567352504087,
        "type": "folder",
        "children": [{
          "id": 1567352520733,
          "type": "pdf",
          "name": "巢到爆的PDF檔",
          "colorTag": null,
          "parentId": 1567352504087,
          "isMarkBoxOpen": false
        }, {
          "id": 1567352534492,
          "type": "img",
          "name": "巢到爆的JPG",
          "colorTag": null,
          "parentId": 1567352504087,
          "isMarkBoxOpen": false
        }],
        "name": "巢到爆",
        "colorTag": "red",
        "parentId": [1, 11, 113],
        "isMarkBoxOpen": false
      }]
    }]
  }, {
    "id": 12,
    "type": "word",
    "parentType": "project",
    "parentId": [1],
    "name": "工作排程表",
    "colorTag": "",
    "isMarkBoxOpen": false
  }, {
    "id": 13,
    "type": "folder",
    "parentType": "project",
    "parentId": [1],
    "name": "已完成專案",
    "colorTag": "green",
    "isMarkBoxOpen": false,
    "children": [{
      "id": 131,
      "type": "word",
      "parentId": [13],
      "name": "會議記錄",
      "colorTag": "red",
      "isMarkBoxOpen": false
    }, {
      "id": 132,
      "type": "pdf",
      "parentId": [13],
      "name": "作品整理",
      "colorTag": "purple",
      "isMarkBoxOpen": false
    }]
  }]
}, {
  "id": 2,
  "type": "project",
  "name": "宜蘭出遊",
  "children": [{
    "id": 22,
    "type": "folder",
    "parentId": [2],
    "name": "行前準備",
    "colorTag": "orange",
    "isMarkBoxOpen": false,
    "children": [{
      "id": 222,
      "type": "word",
      "parentId": [22],
      "name": "兩天行程表",
      "colorTag": "green",
      "isMarkBoxOpen": false
    }, {
      "id": 223,
      "type": "mp4",
      "parentId": [22],
      "name": "狼人殺教學影片",
      "colorTag": "purple",
      "isMarkBoxOpen": false
    }, {
      "id": 224,
      "type": "word",
      "parentId": [22],
      "name": "行李清單",
      "colorTag": "green",
      "isMarkBoxOpen": false
    }]
  }, {
    "id": 23,
    "type": "img",
    "parentType": "project",
    "parentId": [2],
    "name": "獨木舟",
    "colorTag": "",
    "isMarkBoxOpen": false
  }]
}];

$(function () {
  vm = new Vue({
    el: "#app",
    data: {
      projectData: null,
      currentDriveTarget: null,
      modalTodo: {
        addProject: {
          title: '新增專案目錄',
          name: null
        },
        addFile: {
          title: '新增檔案',
          name: null,
          colorTag: null,
          type: null
        },
        addFolder: {
          title: '新增資料夾',
          name: null,
          colorTag: null
        }
      },
      currentModalTodo: 'addProject',
      searchMode: {
        isSearch: false,
        searchInput: null,
        searchContent: null,
        searchResult: null
      }
    },
    computed: {
      getCurrentDrivePath: function getCurrentDrivePath() {
        var _this = this;

        var pathStr = void 0;
        if (this.currentDriveTarget.type === 'project') {
          pathStr = this.currentDriveTarget.name;
        } else {
          var parent = void 0;
          this.currentDriveTarget.parentId.forEach(function (pid, index) {
            if (index === 0) {
              parent = _this.getProject(pid);
              pathStr = parent.name;
            } else {
              parent = parent.children.find(function (folder) {
                return folder.id === pid;
              });
              pathStr += "/" + parent.name;
            }
          });
          pathStr = pathStr + "/" + this.currentDriveTarget.name;
        }
        return pathStr;
      }
    },
    methods: {
      changeCurrentDriveTarget: function changeCurrentDriveTarget(target) {
        this.currentDriveTarget = target;
        this.searchMode.isSearch = false;
      },
      showColorTag: function showColorTag(color) {
        if (!color) return;
        return color;
      },
      showTypeIcon: function showTypeIcon(type) {
        switch (type) {
          case 'folder':
            return 'fa-folder-open';
          case 'img':
            return 'fa-image';
          case 'mp4':
            return 'fa-play-circle';
          case 'word':
            return 'fa-file-word';
          case 'pdf':
            return 'fa-file-pdf';
          default:
            return;
        }
      },
      backToParent: function backToParent() {
        var _this2 = this;

        var parent = void 0;
        this.currentDriveTarget.parentId.forEach(function (pid, index) {
          if (index === 0) {
            parent = _this2.getProject(pid);
          } else {
            parent = parent.children.find(function (folder) {
              return folder.id === pid;
            });
          }
        });
        this.currentDriveTarget = parent;
      },
      toggleMarkBox: function toggleMarkBox(target) {
        target.isMarkBoxOpen = !target.isMarkBoxOpen;
      },
      setColorTag: function setColorTag(color, target) {
        target.colorTag = color;
        target.isMarkBoxOpen = false;
      },
      intoFolder: function intoFolder(target) {
        if (target.type !== 'folder') return;
        this.currentDriveTarget = target;
        this.searchMode.isSearch = false;
      },
      getProject: function getProject(id) {
        return this.projectData.find(function (project) {
          return project.id === id;
        });
      },
      showModal: function showModal(todo) {
        switch (todo) {
          case 'addProject':
            this.currentModalTodo = 'addProject';
            break;
          case 'addFile':
            this.currentModalTodo = 'addFile';
            break;
          case 'addFolder':
            this.currentModalTodo = 'addFolder';
            break;
          default:
            return;
        }
        $('#modal').modal('show');
      },
      addColorTag: function addColorTag(color) {
        this.modalTodo[this.currentModalTodo].colorTag = color;
      },
      addFileType: function addFileType(type) {
        this.modalTodo[this.currentModalTodo].type = type;
      },
      resetModalData: function resetModalData() {
        var modalData = this.modalTodo[this.currentModalTodo];
        for (var key in modalData) {
          if (key !== 'title') {
            modalData[key] = null;
          }
        }
        $('#modal').modal('hide');
      },
      submitModalData: function submitModalData() {
        switch (this.currentModalTodo) {
          case 'addProject':
            if (!this.modalTodo[this.currentModalTodo].name) return;
            this.projectData.push({
              id: new Date().getTime(),
              type: 'project',
              children: [],
              name: this.modalTodo[this.currentModalTodo].name
            });
            break;
          case 'addFile':
            if (!this.modalTodo[this.currentModalTodo].name || !this.modalTodo[this.currentModalTodo].type) return;
            this.currentDriveTarget.children.push({
              id: new Date().getTime(),
              type: this.modalTodo[this.currentModalTodo].type,
              name: this.modalTodo[this.currentModalTodo].name,
              colorTag: this.modalTodo[this.currentModalTodo].colorTag,
              parentId: this.currentDriveTarget.id,
              isMarkBoxOpen: false
            });
            break;
          case 'addFolder':
            if (!this.modalTodo[this.currentModalTodo].name) return;
            var parentIdArr = this.currentDriveTarget.parentId ? [].concat(_toConsumableArray(this.currentDriveTarget.parentId), [this.currentDriveTarget.id]) : [this.currentDriveTarget.id];
            this.currentDriveTarget.children.push({
              id: new Date().getTime(),
              type: 'folder',
              children: [],
              name: this.modalTodo[this.currentModalTodo].name,
              colorTag: this.modalTodo[this.currentModalTodo].colorTag,
              parentId: parentIdArr,
              isMarkBoxOpen: false
            });
            break;
          default:
            return;
        }
        this.resetModalData();
      },
      getSearchResult: function getSearchResult(color) {
        var _this3 = this;

        var tempArr = [];
        var loopChildColor = function loopChildColor(child) {
          // 跑沒有 children 的子層
          if (!child.children && child.colorTag === color) {
            tempArr.push(child);
          }
          // 跑有子層的 folder 及它子層的 loop
          if (child.type === 'folder' && child.children) {
            if (child.colorTag === color) {
              tempArr.push(child);
            }
            child.children.forEach(function (subChild) {
              loopChildColor(subChild);
            });
          }
        };
        var loopChildText = function loopChildText(child) {
          // 跑沒有 children 的子層
          if (!child.children && child.name.indexOf(_this3.searchMode.searchInput) !== -1) {
            tempArr.push(child);
          }
          // 跑有子層的 folder 及它子層的 loop
          if (child.type === 'folder' && child.children) {
            if (child.name.indexOf(_this3.searchMode.searchInput) !== -1) {
              tempArr.push(child);
            }
            child.children.forEach(function (subChild) {
              loopChildText(subChild);
            });
          }
        };
        if (color) {
          // 搜尋符合的顏色標籤
          this.projectData.forEach(function (project) {
            project.children.forEach(function (child) {
              loopChildColor(child);
            });
          });
          this.searchMode.searchContent = color + " tag";
        } else {
          // 搜尋關鍵字
          if (!this.searchMode.searchInput) return;
          this.projectData.forEach(function (project) {
            project.children.forEach(function (child) {
              loopChildText(child);
            });
          });
          this.searchMode.searchContent = this.searchMode.searchInput;
          this.searchMode.searchInput = '';
        }
        this.searchMode.searchResult = tempArr;
        this.searchMode.isSearch = true;
      }
    },
    created: function created() {
      this.projectData = projectData;
      this.currentDriveTarget = this.projectData[0];
    }
  });
});
//# sourceMappingURL=cloud-drive.js.map
