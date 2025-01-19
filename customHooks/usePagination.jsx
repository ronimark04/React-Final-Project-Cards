import { useState, useMemo } from "react";

const usePagination = (items, cardsPerPage = 6, pagesPerGroup = 3) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(1);

    const totalPages = Math.ceil(items.length / cardsPerPage);
    const totalPageGroups = Math.ceil(totalPages / pagesPerGroup);

    const indexOfLastItem = currentPage * cardsPerPage;
    const indexOfFirstItem = indexOfLastItem - cardsPerPage;

    const currentItems = useMemo(
        () => items.slice(indexOfFirstItem, indexOfLastItem),
        [items, indexOfFirstItem, indexOfLastItem]
    );

    const startPage = (pageGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPageGroup = () => {
        if (pageGroup < totalPageGroups) {
            setPageGroup(pageGroup + 1);
            setCurrentPage(pageGroup * pagesPerGroup + 1);
        }
    };

    const handlePreviousPageGroup = () => {
        if (pageGroup > 1) {
            setPageGroup(pageGroup - 1);
            setCurrentPage((pageGroup - 2) * pagesPerGroup + 1);
        }
    };

    return {
        currentItems,
        currentPage,
        totalPages,
        pageGroup,
        totalPageGroups,
        pageNumbers,
        handlePageClick,
        handleNextPageGroup,
        handlePreviousPageGroup,
    };
};

export default usePagination;
