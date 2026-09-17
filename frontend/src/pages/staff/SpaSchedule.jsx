import StitchShell from '../../components/staff/StitchShell'
import { useSpaAppointments } from '../../hooks/useSpaAppointments'

function SpaSchedule() {
  const { services, isLoading, error, refresh } = useSpaAppointments()

  return (
    <StitchShell
      breadcrumb={<><button type="button" onClick={() => window.location.assign('/staff/dashboard')}>Dashboard</button> <span>&gt;</span> Spa Schedule &amp; Appointments</>}
      title="Today&apos;s Spa Schedule"
      subtitle="Real-time treatment catalog and staff-visible spa desk status."
      roleInitials="SD"
      roleLabel="Spa Director"
      onRefresh={refresh}
      refreshLabel="Refresh Schedule"
      refreshing={isLoading}
    >
      {error ? <div className="stitch-state error-state">{error}<button type="button" onClick={refresh}>Retry</button></div> : null}
      {isLoading ? <div className="stitch-state">Loading spa schedule...</div> : null}

      {!isLoading && !error ? (
        <>
          <section className="stitch-kpis">
            <div><span>Total Spa Services</span><strong>{services.length}</strong><small>Active in the treatment catalog</small></div>
            <div>
              <span>Avg. Duration</span>
              <strong>
                {services.length
                  ? Math.round(
                      services.reduce((total, s) => total + (Number(s.duration_minutes) || 0), 0) / services.length,
                    )
                  : 0}{' '}
                min
              </strong>
              <small>Across all listed services</small>
            </div>
            <div><span>Status</span><strong>Available</strong><small>All catalog services bookable today</small></div>
          </section>

          <section className="stitch-panel arrivals-panel">
            <div className="panel-heading"><h3>Spa Service Catalog</h3></div>
            {services.length === 0 ? (
              <div className="stitch-state">No spa services available.</div>
            ) : (
              <div className="stitch-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Service ID</th>
                      <th>Service Name</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td className="mono">{service.id}</td>
                        <td>{service.name}</td>
                        <td>{service.duration_minutes} min</td>
                        <td><span className="status confirmed">Available</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </StitchShell>
  )
}

export default SpaSchedule


