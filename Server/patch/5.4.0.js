

var project=require("../model/projectModel");
var test=require("../model/testModel");
var testGroup=require("../model/testGroupModel");
var testModule=require("../model/testModuleModel");
var testProject=require("../model/testProjectModel");
var poll=require("../model/pollModel");
var testCollection=require("../model/testCollectionModel");
var uuid=require("uuid");
var mongoose = require('mongoose');
var db=require("../util/db.js");
module.exports=async function () {
    let modalA=db.model("TestModuleVersion",new mongoose.Schema({}));
    let modalB=db.model("TestGroupVersion",new mongoose.Schema({}));
    let modalC=db.model("TestVersion",new mongoose.Schema({}));
    for ( let model of [modalA,modalB,modalC] ) {
        let list = await (model.db.db.listCollections({
            name: model.collection.name
        }).toArray());
        if ( list.length !== 0 ) {
            await (model.collection.drop());
        }
    }
    let arr=await (testModule.findAsync({},"project"));
    arr=arr.map(function (obj) {
        return obj.project.toString();
    })
    arr=arr.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    })
    for(let o of arr)
    {
        let objProject=await (project.findOneAsync({
            _id:o
        }))
        if(!objProject)
        {
            continue;
        }
        let query={
            name:objProject.name,
            owner:objProject.owner,
            users:objProject.users.map(function (obj) {
                return obj.user;
            })
        }
        if(objProject.dis)
        {
            query.dis=objProject.dis;
        }
        if(objProject.team)
        {
            query.team=objProject.team
        }
        let objTestProject=await (testProject.createAsync(query));
        let objPoll=await (poll.findOneAndUpdateAsync({
            project:objProject._id
        },{
            project:objTestProject._id,
            owner:objTestProject.owner
        },{
            new:true
        }))
        let arrTestModule=await (testModule.findAsync({
            project:o
        }));
        for(let objModule of arrTestModule)
        {
            let arrTestGroup=await (testGroup.findAsync({
                module:objModule._id
            }));
            objModule.data=arrTestGroup;
            for(let objGroup of objModule.data)
            {
                let arrTest=await (test.findAsync({
                    group:objGroup._id
                }))
                objGroup.data=arrTest;
            }
        }
        let arrUser=[objProject.owner].concat(query.users);
        for(let u of arrUser)
        {
            let objId={};
            for(let objModule of arrTestModule)
            {
                let objNewModule=await (testModule.createAsync({
                    name:objModule.name,
                    project:objTestProject._id,
                    id:objModule.id?objModule.id:uuid(),
                    user:u
                }))
                for(let objGroup of objModule.data)
                {
                    let objNewGroup=await (testGroup.createAsync({
                        name:objGroup.name,
                        module:objNewModule._id,
                        project:objTestProject._id,
                        id:objGroup.id?objGroup.id:uuid(),
                        user:u
                    }))
                    for(let objTest of objGroup.data)
                    {
                        let objNewTest=await (test.createAsync({
                            name:objTest.name,
                            project:objTestProject._id,
                            module:objNewModule._id,
                            group:objNewGroup._id,
                            remark:objTest.remark,
                            owner:u,
                            editor:u,
                            status:objTest.status,
                            code:objTest.code,
                            output:objTest.output,
                            id:objTest.id?objTest.id:uuid(),
                            user:u
                        }))
                        objId[objTest._id]=objNewTest._id
                    }
                }
            }
            if(objPoll)
            {
                let i=0;
                let arr=[];
                objPoll.test.forEach(function (obj) {
                    if(objId[obj])
                    {
                        arr.push({
                            test:objId[obj],
                            output:"",
                            argv:[],
                            status:0,
                            id:i++,
                            time:0,
                            mode:"code"
                        })
                    }
                })
                let query={
                    name:"未命名",
                    project:objTestProject._id,
                    tests:arr,
                    user:u
                }
                if(u.toString()==objProject.owner.toString())
                {
                    query.poll=objPoll._id;
                }
                await (testCollection.createAsync(query));
            }
        }
        for(let objModule of arrTestModule)
        {
            for(let objGroup of objModule.data)
            {
                for(let objTest of objGroup.data)
                {
                    await (objTest.removeAsync());
                }
                await (objGroup.removeAsync());
            }
            await (objModule.removeAsync());
        }
    }
}









