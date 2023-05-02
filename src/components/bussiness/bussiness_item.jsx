import React, { useEffect } from "react";
import { useState } from "react";
import '../../dist/css/custom_card.css';

const BusinessItem = ({ plan, periods, period }) => {
    const [item, setItem] = useState(null);
    const [period_id, setPeriod_id] = useState();

    useEffect(() => {
        const item = periods.find((x) => x.period == period);
        if (item != null) {
            setPeriod_id(item.id)
        }
        setItem(item);
    }, [period])

    return (
        <>
            <div className="col-lg-4 mt-3 mt-lg-0">
                <div className="border">
                    <div className="card-body">
                        <h5 className="card-title">{plan.name}</h5>
                        <hr />
                        <h6 className="card-subtitle mb-2 text-center py-4">
                            <del>{item != null ? item.old_price : ""} /
                                <small className="text-muted label">месяц</small>
                            </del>
                        </h6>
                        <h6 className="card-subtitle mb-2 text-center py-4">
                            {item != null ? item.price : ""} /
                            <small className="text-muted label">месяц</small>
                        </h6>
                        <a href={`/business-plan/${plan.id}/${period_id}`} className="btn btn-primary rounded-pill col-12 text-white">
                            Подключить
                        </a>
                        <hr />
                        <div className="border p-2 rounded">
                            <span className="label"><strong>Описание</strong></span>
                            <p className="card-text label text-muted">{plan.description}</p>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BusinessItem;