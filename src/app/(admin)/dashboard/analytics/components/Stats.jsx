import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';
import { statData } from '../data';
import { Link } from 'react-router-dom';
import { API_URL_SELLER } from '../../../../../context/constants'
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useAuthContext } from '../../../../../context/useAuthContext'

const StatCard = ({
  change,
  icon,
  stat,
  title,
  variant
}) => {
  return <Card>
      <CardBody>
        <Row>
          <Col xs={6}>
            <div className="avatar-md bg-light bg-opacity-50 rounded flex-centered">
              <IconifyIcon icon={icon} className="fs-32 text-success" />
            </div>
          </Col>
          <Col xs={6} className="text-end">
            <p className="text-muted mb-0 text-truncate">{title}</p>
            <h3 className="text-dark mt-2 mb-0">{stat}</h3>
          </Col>
        </Row>
      </CardBody>
      {/* <CardFooter className="border-0 py-2 bg-light bg-opacity-50">
        <div className="d-flex align-items-center justify-content-between ">
          <div>
            <span className={`text-${variant} icons-center`}>
              {' '}
              <IconifyIcon icon={`bxs:${variant === 'danger' ? 'down' : 'up'}-arrow`} className="fs-12 " />
              &nbsp;{change}
            </span>
            <span className="text-muted ms-1 fs-12">&nbsp;Last Month</span>
          </div>
          <Link to="" className="text-reset fw-medium fs-12">
            View More
          </Link>
        </div>
      </CardFooter> */}
    </Card>;
};
const Stats = () => {
    const [counts, setCounts] = useState(null);
  const { user } = useAuthContext()

  useEffect(() => {
    axios
      .get(`${API_URL_SELLER}user/seller-dashboard-count`,{
        headers: {
          Authorization: `Bearer ${user?.token}`,
        }})
      .then((res) => setCounts(res.data.data))
      .catch((err) => console.error('Dashboard count error:', err));
  }, []);

  if (!counts) return <div>Loading...</div>;
  const dynamicStatData = [
    {
      title: "Today's Orders",
      stat: counts.totalOrdersToday,
      icon: 'fluent:clipboard-pulse-24-filled',
      variant: 'primary',
    },
    {
      title: "Today's Revenue",
      stat: `${counts.totalRevenueToday}`,
      icon: 'mdi:cash-fast',
      variant: 'success',
    },
    {
      title: 'Weekly Orders',
      stat: counts.totalOrdersWeek,
      icon: 'mdi:calendar-week',
      variant: 'info',
    },
    {
      title: 'Monthly Revenue',
      stat: `${counts.totalRevenueMonth}`,
      icon: 'mdi:cash-multiple',
      variant: 'warning',
    },
  ];

  return (
    // <Row>
    //   {stateData.map((stat, idx) => (
    //     <Col md={6} xxl={12} key={idx}>
    //       <StatCard {...stat} />
    //     </Col>
    //   ))}
    // </Row>
    <Row>
      {dynamicStatData.map((stat, idx) => <Col md={6} xl={3} key={idx}>
          <StatCard {...stat} />
        </Col>)}
    </Row>
  );
};
export default Stats;