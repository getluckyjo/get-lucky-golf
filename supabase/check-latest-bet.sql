-- Confirm the most recent bet(s) and whether PayFast's ITN confirmed payment.
-- A pf_… payment_intent_id (not gl_…) + status 'active' = ITN webhook landed.
select b.id,
       b.status,
       b.tier,
       b.stake_pence,
       b.payment_intent_id,
       b.created_at,
       u.email
  from public.bets b
  left join auth.users u on u.id = b.user_id
 order by b.created_at desc
 limit 5;
