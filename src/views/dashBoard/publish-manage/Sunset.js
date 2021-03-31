import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Sunset() {
    const {dataSource,deletePublish} = usePublish(3)
    return (
        <div>
            <NewsPublish dataSource={dataSource} state={3} handleClick={(item)=>deletePublish(item)}></NewsPublish>
        </div>
    )
}
