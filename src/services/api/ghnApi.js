import { ghnExecAPI } from "../../stf/common";

export async function getAllProvince() {
  const [error, result] = await ghnExecAPI({
    url: "shiip/public-api/master-data/province",
  });

  if (error) {
    return null;
  }

  const { data } = result.data;

  return data;
}

export async function getAllDistrictByProvince(provinceId) {
  const [error, result] = await ghnExecAPI({
    url: "shiip/public-api/master-data/district",
    data: { province_id: provinceId },
  });

  if (error) {
    return null;
  }

  const { data } = result.data;

  return data;
}
 
export async function getAllWardByDistrict(districtId) {
  const [error, result] = await ghnExecAPI({
    url: "shiip/public-api/master-data/ward",
    data: { district_id: districtId },
  });

  if (error) {
    return null;
  }

  const { data } = result.data;

  return data;
}