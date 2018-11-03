module.exports = class ApplicationPolicy {

    constructor(user, record) {
        this.user = user;
        this.record = record;
    }

    _isOwner() {
        return this.record && (this.record.userId == this.user.id);
    }

    _isAdmin() {
        return this.user && this.user.role == "admin";
    }


    _isStandard() {
        return this.user && this.user.role == "standard";
    }

    _isPremium() {
        return this.user && this.user.role == "premium";
    }

    _isPublic() {
        return this.record.private === false;
    }

    _isPrivate() {
        return this.record.private === true;
    } 
    
    new() {
        return this.user != null;
    }

    create() {
        return this.new();
    }

    show() {
        return true;
    }

    edit() {
        return this.new();
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.new() &&
            this.record && (this._isOwner() || this._isAdmin());
    }
}