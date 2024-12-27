

exports.parseQuery=(query,params)=>{
    const { select, filter, limit, skip, sort, populate } = params;

    // Select fields
    if (select) {
      const fields = select.split(',').join(' ');
      query = query.select(fields);
    }

    // Filter
    if (filter) {
      const filterObj = JSON.parse(filter);
      query = query.find(filterObj);
    }

    // Limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }else{
      query = query.limit(10);
    }

    // Skip
    if (skip) {
      query = query.skip(parseInt(skip));
    }

    // Sort
    if (sort) {
      const sortObj = JSON.parse(sort);
      query = query.sort(sortObj);
    }

    if (populate) {
      const fields = populate.split(',').join(' ');
      query = query.populate(fields);
    }
    return query;
}