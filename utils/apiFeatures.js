class APIFeature {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // Functionality methods
    filter() {
        const queryObj = {...this.queryString};
        const excludeQuery = ['page', 'sort', 'limit', 'fields'];
        excludeQuery.forEach(el => delete queryObj[el]);
        console.log(queryObj);
    
        // Advanced filtering
        // 1- Transform query object to string
        let queryStr = JSON.stringify(queryObj);
    
        // 2- Find and replace specifique comparaison operator
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|eq)\b/g, match => `$${match}`);
        console.log(this.queryStr)
    
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query
                            .sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createAt');
        }
        return this;
    }

    limitFields(){
        if (this.queryString.fields) {
            let field = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(field);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        if (this.queryString.page || this.queryString.limit) {
            this.query = this.query
                            .skip(skip)
                            .limit(limit)
        }
        return this;
    }
}

module.exports = APIFeature;