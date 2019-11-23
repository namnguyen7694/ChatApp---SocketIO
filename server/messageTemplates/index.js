module.exports.generateMessage = (from, content) => {
    return{
        from,
        content,
        createdAt: new Date()
    }
}

module.exports,this.generateLocation = (from, lat, lng) => {
    return {
        from,
        lat, lng,
        createdAt: new Date()
    }
}