class Room {
    constructor () {
        this.users = []
    }
    /**
     * @todo add new User
     */
    addUser (id, name, room) {
        const user = {id, name, room}
        this.users.push(user)
    }
    /**
     * @todo position of User
     */
    findUserIndexById (id) {
        return this.users.findIndex(e => e.id === id)
    }
    /**
     * @todo find onen User by ID
     */
    findUserById (id) {
        const index = this.findUserIndexById(id)
        return this.users[index]
    }
    removeUserById (id) {
        const index = this.findUserIndexById(id)
        const user = this.users[index]
        this.users.splice(index, 1);
        return user;
    }
    findUsersInRoom (room) {
        return this.users.filter(u => u.room ===room)
    }
}
module.exports = Room;
