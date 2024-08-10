import axios from "axios";
import { PageInfo } from "../../models/pageInfo.type";
import { Review } from "../../models/review.type";
import { delay } from "../../utils/delay";

interface ReviewWithPagination {
    pageInfo: PageInfo
    data: Review[]
}

export const getAllReviewsWithPagination = async (
    search: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string) => 
    {
    try {
        pageNumber = pageNumber - 1

        const params = {
        name: search,
        pageNumber,
        pageSize,
        sortBy
        }

        const response = await axios.get<Review[]>('/api/review', { params })

        await delay(300)

        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.error(error)
        throw new Error('Lấy danh sách đánh giá thất bại')
    }
}