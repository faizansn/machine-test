

exports.find = async (model, query, skip, limit, sortObject, _project, _lookups) => {
    const result = await model.aggregate([
        ..._lookups,
        { $match: { ...query } },
        {
          $facet: {
            totalResponses: [{ $count: "count" }],
            result: [
              { $sort: sortObject},
              { $skip: skip },
              { $limit: limit },
              { $project: _project }
            ]
          }
        },
        {
          $project: {
            totalResponses: { $arrayElemAt: ["$totalResponses.count", 0] },
            result: 1
          }
        }
    ]);
    return result;
}

exports.findByIdAndUpdate = async (model, _id, body) => {
  const result = await model.findByIdAndUpdate(_id, body, { new: true });
  return result;
}
