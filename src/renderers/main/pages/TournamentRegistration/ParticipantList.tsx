import React from 'react';
import { TableStyle, TableTabs } from './styled';
import trashIcon from '../../../../assets/icons/trash.svg';
import arrowUp from '../../../../assets/icons/arrow-up.svg';
import Icon from '@components/Icon';


const arrray = new Array(50).fill(null);

const columns = [
    {
        title: 'Tên',
    },
    {
        title: 'Đội',
    },
    {
        title: 'Sđt',
    },
    {
        title: 'Mail',
    },
    {
        title: 'Hạng trong đội',
    },
    {
        title: '',
    }
]

const ParticipantList = () => {
    return (
        <>
            <TableTabs>
                <div className="tab-item active">
                    Tất cả
                </div>
                <div className="tab-item">
                    Tambo
                </div>
                <div className="tab-item">
                    Hoàng Long
                </div>
                <div className="tab-item">
                    Cặc
                </div>
            </TableTabs>
            <TableStyle>
                <table className='table-header'>
                    <colgroup>
                        <col span={5} width={150} />
                        <col width={'auto'} />
                    </colgroup>
                    <thead>
                        {
                            columns.map((item, idx) => (
                                <th key={idx}>
                                    {item.title}
                                </th>
                            ))
                        }
                    </thead>
                </table>
                <div className='table-body-container tambo-scrollbar'>
                    <table>
                        <colgroup>
                            <col span={5} width={150} />
                        </colgroup>
                        <tbody>
                            {
                                arrray.map((_, mainIndex) => (
                                    <tr key={mainIndex}>
                                        {
                                            columns.map((_, idx) => (
                                                <td key={idx}>
                                                    {
                                                        idx !== 5 ? <div>
                                                            Chiêu Anh
                                                        </div> : <div className='action'>
                                                            {mainIndex > 0 && <Icon src={arrowUp} />}
                                                            {mainIndex < arrray.length - 1 && <Icon src={arrowUp} className='down'/>}
                                                            <Icon src={trashIcon} />
                                                        </div>}

                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </TableStyle>
        </>
    )
}

export default ParticipantList