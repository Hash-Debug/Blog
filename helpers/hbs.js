const moment = require('moment')

module.exports={
    formatDate: (date,format)=>{
        return moment(date).format(format)
    },
    truncate :(str)=>{
        if (str.length>150 && str.length>0){
            let news=str + ''
            news= str.substr(0,150)
            news= str.substr(0,news.lastIndexOf(''))
            news= news.length>0? news:str.substr(0,150)
            return news + '....'
        }
        return str
    },
    stripTags: (input)=>{
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: (storyUser, loggedUser, StoryId,floating=true)=>{
        if (storyUser._id.toString() == loggedUser._id.toString()){
            if (floating){
                return `<a href="stories/edit/${StoryId}" class='btn-floating halfway-fab pink'><i class="fa fa-edit fa-small"></i></a>`
            }
            else{
                return `<a href="stories/edit/${StoryId}"><i class="fa fa-edit"></i></a>`
            }
        }
        else{
            return ''
        }
    },
}


