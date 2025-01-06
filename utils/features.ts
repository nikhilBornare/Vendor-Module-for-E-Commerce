import Vendor from "../models/vendorModel";

interface QueryFeatures {
  search?: string;
  rating?: string;
  status?: "active" | "inactive";
  sort?:
    | "name"
    | "createdAtAsc"
    | "updatedAtAsc"
    | "createdAtDesc"
    | "updatedAtDesc"
    | "status"
    | "statusDesc";
  page?: number;
  limit?: number;
}

const getFilteredSortedPaginatedVendors = async (queryFeatures: QueryFeatures) => {
  const { search, rating, sort, page = 1, limit = 10 } = queryFeatures;

  const query: any = {};

  // Filter by name (search)
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // Filter by vendorRating
  if (rating) {
    query.vendorRating = { $gte: parseFloat(rating) };
  }

  // Filter by status (active/inactive)
  if (queryFeatures.status) {
    query.status = queryFeatures.status;
  }

  // Sorting
  let sortOption = {};
  const sortOptionsMap = {
    name: { name: 1 },
    nameDesc: { name: -1 },
    createdAtAsc: { createdAt: 1 },
    updatedAtAsc: { updatedAt: 1 },
    createdAtDesc: { createdAt: -1 },
    updatedAtDesc: { updatedAt: -1 },
    status: { status: 1 },
    statusDesc: { status: -1 },
  };

  if (sort) {
    sortOption = sortOptionsMap[sort] || {};
  }

  // Fetch filtered, sorted, and paginated vendors
  const vendors = await Vendor.find(query)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort(sortOption);

  return {
    vendors,
    total: await Vendor.countDocuments(query),
    page: Number(page),
    limit: Number(limit),
  };
};

export default getFilteredSortedPaginatedVendors;
