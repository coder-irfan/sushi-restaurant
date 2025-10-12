import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardHome from './DashboardHome';
const AddSushi = lazy(() => import('./AddSushi'));
const ManageSushis = lazy(() => import('./ManageSushis'));
const Orders = lazy(() => import('./Orders'));
const OrderDetails = lazy(() => import('./OrderDetails'));
const Reservations = lazy(() => import('./Reservations'));
const ReservationDetails = lazy(() => import('./ReservationDetails'));
const Users = lazy(() => import('./Users'));
const Activity = lazy(() => import('./Activity'));
import Loader from '../pages/Loader';

function Dashboard() {
  return (
    <>
      <div className="">
        <Navbar />
        <hr />
        <div className="">
          <Routes>
            <Route index element={<DashboardHome />}></Route>
            <Route
              path="add-sushi"
              element={
                <Suspense fallback={<Loader />}>
                  {' '}
                  <AddSushi />{' '}
                </Suspense>
              }
            ></Route>
            <Route
              path="add-sushi/:id"
              element={
                <Suspense fallback={<Loader />}>
                  {' '}
                  <AddSushi />{' '}
                </Suspense>
              }
            ></Route>
            <Route
              path="manage-sushis"
              element={
                <Suspense fallback={<Loader />}>
                  {' '}
                  <ManageSushis />{' '}
                </Suspense>
              }
            ></Route>
            <Route
              path="orders"
              element={
                <Suspense fallback={<Loader />}>
                  {' '}
                  <Orders />{' '}
                </Suspense>
              }
            ></Route>
            <Route
              path="orders/:id"
              element={
                <Suspense fallback={<Loader />}>
                  <OrderDetails />
                </Suspense>
              }
            ></Route>
            <Route
              path="reservations"
              element={
                <Suspense fallback={<Loader />}>
                  {' '}
                  <Reservations />{' '}
                </Suspense>
              }
            ></Route>
            <Route
              path="reservations/:id"
              element={
                <Suspense fallback={<Loader />}>
                  <ReservationDetails />
                </Suspense>
              }
            ></Route>
            <Route
              path="users"
              element={
                <Suspense fallback={<Loader />}>
                  {' '}
                  <Users />{' '}
                </Suspense>
              }
            ></Route>
            <Route
              path="activity"
              element={
                <Suspense fallback={<Loader />}>
                  {' '}
                  <Activity />{' '}
                </Suspense>
              }
            ></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
